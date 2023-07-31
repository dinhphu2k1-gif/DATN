package org.hust.job.stream;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.model.CityResponse;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.function.MapPartitionsFunction;
import org.apache.spark.broadcast.Broadcast;
import org.apache.spark.sql.*;
import org.apache.spark.sql.api.java.UDF1;
import org.apache.spark.sql.catalyst.encoders.ExpressionEncoder;
import org.apache.spark.sql.catalyst.encoders.RowEncoder;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.StructType;
import org.apache.spark.streaming.api.java.JavaInputDStream;
import org.apache.spark.streaming.kafka010.ConsumerStrategies;
import org.apache.spark.streaming.kafka010.LocationStrategies;
import org.hust.job.ArgsOptional;
import org.hust.job.IJobBuilder;
import org.hust.model.event.Event;
import org.hust.utils.IpLookupUtils;
import org.hust.utils.KafkaUtils;
import org.hust.utils.SparkUtils;
import org.hust.utils.maxmind.MaxMindWrapper;
import org.joda.time.DateTime;
import scala.collection.JavaConverters;

import java.net.InetAddress;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.apache.spark.sql.functions.call_udf;
import static org.apache.spark.sql.functions.col;

public class CollectEventBatch implements IJobBuilder {
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
        sparkUtils = new SparkUtils("collect event to log", "yarn", args.getDuration());
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

    public Dataset<Row> ipMapping(Dataset<Row> df) {
        StructType schema = new StructType()
                .add("user_ipaddress", DataTypes.StringType, false)
                .add("geo_city", DataTypes.StringType, false);
        ExpressionEncoder<Row> encoder = RowEncoder.apply(schema);

        List<Row> ipList = df.select("user_ipaddress")
                .distinct()
                .collectAsList();
        List<Row> mappingList = new ArrayList<>();
        for (Row row : ipList) {
            String user_ipaddress = row.getAs("user_ipaddress");
            String ip = user_ipaddress.substring(0, user_ipaddress.length() - 1) + 1;

            String city = IpLookupUtils.convertIpTo(IpLookupUtils.Type.CITY, ip);
            System.out.println("ip: " + ip + "\tcity: " + city);

            Row record = RowFactory.create(user_ipaddress, city);
            mappingList.add(record);
        }

        Dataset<Row> ipMappingDf = spark.createDataFrame(mappingList, schema);
        return ipMappingDf;
    }

    @Override
    public void run(ArgsOptional args) {
        loadAgrs(args);
        init();

        Encoder<Event> eventEncoder = Encoders.bean(Event.class);
//        MaxMindWrapper maxMindWrapper = new MaxMindWrapper();
//        Broadcast<MaxMindWrapper> readerBroadcast = sparkUtils.getJavaSparkContext().broadcast(maxMindWrapper);
//        System.out.println("reader: " + maxMindWrapper.getReader());

        stream.foreachRDD((consumerRecordJavaRDD, time) -> {
            JavaRDD<Event> rows = consumerRecordJavaRDD
                    .map(consumerRecord -> RowFactory.create(consumerRecord.value(), consumerRecord.topic()))
                    .map(CollectEventBatch::transformRow)
                    .filter(Objects::nonNull);

            Dataset<Row> data = spark.createDataFrame(rows.rdd(), Event.class)
                    .drop("geo_city");

            System.out.println("ip mapping");
            Dataset<Row> ipMapping = ipMapping(data);
            ipMapping.show();

            data = data.join(ipMapping, JavaConverters.asScalaBuffer(Collections.singletonList("user_ipaddress")).seq())
                            .cache();

            System.out.println("num record: " + data.count());
            data.show();

            String dateTime = dateTimeFormat.format(new DateTime(time.milliseconds()).toDate());
            String path = "hdfs://hadoop23202:9000/user/phuld/data/event/" + dateTime;
            data.coalesce(1)
                    .write()
                    .mode(SaveMode.Append)
                    .parquet(path);

            System.out.println("write to: " + path);

            data.unpersist();
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
