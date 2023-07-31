package org.hust.job.stream;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.model.CityResponse;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.broadcast.Broadcast;
import org.apache.spark.sql.*;
import org.apache.spark.sql.api.java.UDF1;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.streaming.api.java.JavaInputDStream;
import org.apache.spark.streaming.kafka010.*;
import org.hust.job.ArgsOptional;
import org.hust.job.IJobBuilder;
import org.hust.loader.IRecord;
import org.hust.loader.kafka.elasticsearch.InsertDocument;
import org.hust.model.event.Event;
import org.hust.model.event.EventType;
import org.hust.service.mysql.MysqlService;
import org.hust.utils.IpLookupUtils;
import org.hust.utils.KafkaUtils;
import org.hust.utils.SparkUtils;
import org.hust.utils.maxmind.MaxMindWrapper;
import org.joda.time.DateTime;

import java.net.InetAddress;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.apache.spark.sql.functions.call_udf;
import static org.apache.spark.sql.functions.col;

public class CollectEventStream implements IJobBuilder {
    private SparkUtils sparkUtils;
    private SparkSession spark;
    private JavaInputDStream<ConsumerRecord<Object, Object>> stream;
    private static final SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy_MM_dd/HH_mm_ss");
    private ArgsOptional args;
    private Set<String> topicList;

    public void loadAgrs(ArgsOptional args) {
        this.args = args;
        this.topicList = new HashSet<>(Arrays.asList(args.getTopics().split(",")));
    }

    public void init() {
        sparkUtils = new SparkUtils("collect event to es", "yarn", args.getDuration());
        spark = sparkUtils.getSparkSession();

        KafkaUtils kafkaUtils = new KafkaUtils(args.getGroupId(), topicList);

        stream = org.apache.spark.streaming.kafka010.KafkaUtils
                .createDirectStream(sparkUtils.getJavaStreamingContext(),
                        LocationStrategies.PreferConsistent(),
                        ConsumerStrategies.Subscribe(kafkaUtils.getTopics(), kafkaUtils.getKafkaParams())
                );
    }

    public static Event transformRow(Row row) {
        String value = row.getAs(0);
        System.out.println(value);
        return new Event(value);
    }

    public void insertIntoEs(Dataset<Event> ds) {
        ds.foreachPartition(t -> {
            while (t.hasNext()) {
                Event event = t.next();

                switch (event.getEvent()) {
                    case EventType.UNSTRUCT: {
                        IRecord iRecord = IRecord.createRecord(event);
                        try {
                            InsertDocument.insertDocument(iRecord);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                    break;
                }
            }
        });
    }

    public void insertMapping(Dataset<Event> ds) {
        Dataset<Row> mapping = ds.select("user_id", "domain_userid")
                .filter("user_id != '' and domain_userid != ''")
                .dropDuplicates();

        mapping.foreachPartition(t -> {
            MysqlService mysqlService = new MysqlService();

            while (t.hasNext()) {
                Row row = t.next();

                try {
                    int user_id = Integer.parseInt(row.getString(0));
                    String domain_userid = row.getString(1);
                    System.out.println("user_id: " + user_id + "\tdomain_userid: " + domain_userid);

                    boolean exist = mysqlService.checkExistMapping(user_id, domain_userid);
                    if (!exist) {
                        mysqlService.insertMapping(user_id, domain_userid);
                        System.out.println("insert mapping");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

            }
        });
    }

    @Override
    public void run(ArgsOptional args) {
        loadAgrs(args);
        init();

        Encoder<Event> eventEncoder = Encoders.bean(Event.class);
        
        stream.foreachRDD((consumerRecordJavaRDD, time) -> {
//            OffsetRange[] offsetRanges = ((HasOffsetRanges) consumerRecordJavaRDD.rdd()).offsetRanges();

            String dateTime = dateTimeFormat.format(new DateTime(time.milliseconds()).plusHours(7).toDate());
            System.out.println("time: " + dateTime);

            JavaRDD<Event> rows = consumerRecordJavaRDD
                    .map(consumerRecord -> RowFactory.create(consumerRecord.value(), consumerRecord.topic()))
                    .map(CollectEventStream::transformRow)
                    .filter(Objects::nonNull);

            Dataset<Event> ds = spark.createDataset(rows.rdd(), eventEncoder)
                    .repartition(20)
                    .persist();
            System.out.println("num record: " + ds.count());

            ds.select("app_id", "platform", "dvce_created_tstamp", "event", "event_id",
                    "user_id", "user_ipaddress", "domain_userid", "geo_city", "contexts", "unstruct_event").show();

            long t2 = System.currentTimeMillis();
            insertIntoEs(ds);
            System.out.println("time insert es: " + (System.currentTimeMillis() - t2) + " ms");

            long t3 = System.currentTimeMillis();
            insertMapping(ds);
            System.out.println("time insert mysql: " + (System.currentTimeMillis() - t3) + " ms");

            ds.unpersist();

//            ((CanCommitOffsets) stream.inputDStream()).commitAsync(offsetRanges);
        });

        // start
        sparkUtils.getJavaStreamingContext().start();

        // await
        try {
            sparkUtils.getJavaStreamingContext().awaitTermination();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
