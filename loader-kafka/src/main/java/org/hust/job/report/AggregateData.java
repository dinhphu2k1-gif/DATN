package org.hust.job.report;

import org.apache.spark.api.java.function.MapPartitionsFunction;
import org.apache.spark.sql.*;
import org.apache.spark.sql.api.java.UDF1;
import org.apache.spark.sql.catalyst.encoders.ExpressionEncoder;
import org.apache.spark.sql.catalyst.encoders.RowEncoder;
import org.apache.spark.sql.expressions.Window;
import org.apache.spark.sql.expressions.WindowSpec;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.StructType;
import org.apache.spark.storage.StorageLevel;
import org.hust.model.entity.IContext;
import org.hust.model.entity.impl.ProductContext;
import org.hust.model.event.Event;
import org.hust.model.event.unstruct.IUnstructEvent;
import org.hust.model.event.unstruct.impl.ProductAction;
import org.hust.model.event.unstruct.impl.SearchAction;
import org.hust.service.mysql.MysqlService;
import org.hust.utils.DateTimeUtils;
import org.hust.utils.SparkUtils;
import scala.collection.JavaConverters;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.apache.spark.sql.functions.*;

public class AggregateData {
    private final SparkUtils sparkUtils;
    private final SparkSession spark;

    public AggregateData() {
        sparkUtils = new SparkUtils("aggregate data", "yarn", 60);
        spark = sparkUtils.getSparkSession();
    }

    /**
     * Phân tích các sự kiên liên quan đến sản phẩm
     */
    public void productAnalysis(Dataset<Row> df) {
        StructType schema = new StructType()
                .add("time", DataTypes.LongType, false)
                .add("action", DataTypes.StringType, false)
                .add("product_id", DataTypes.IntegerType, false)
                .add("product_name", DataTypes.StringType, true)
                .add("quantity", DataTypes.IntegerType, false)
                .add("price", DataTypes.IntegerType, true)
                .add("category_id", DataTypes.IntegerType, true);

        ExpressionEncoder<Row> encoder = RowEncoder.apply(schema);

        Dataset<Row> data = df.select("time", "contexts", "unstruct_event")
                .mapPartitions((MapPartitionsFunction<Row, Row>) t -> {
                    List<Row> rowList = new ArrayList<>();

                    while (t.hasNext()) {
                        Row row = t.next();

                        try {
                            long time = row.getLong(0);
                            String dataContexts = row.getString(1);
                            String dataUnstruct = row.getString(2);

                            List<IContext> contextList = IContext.createContext(dataContexts);
                            IUnstructEvent unstructEvent = IUnstructEvent.createEvent(dataUnstruct);

                            if (!(unstructEvent instanceof ProductAction)) {
                                continue;
                            }

                            ProductAction productAction = (ProductAction) unstructEvent;

                            for (IContext context : contextList) {
                                if (context instanceof ProductContext) {
                                    ProductContext productContext = (ProductContext) context;

                                    assert productAction != null;
                                    Row record = RowFactory.create(
                                            time,
                                            productAction.getAction(),
                                            productContext.getProduct_id(),
                                            productContext.getProduct_name(),
                                            productContext.getQuantity(),
                                            productContext.getPrice(),
                                            productContext.getCategory_id());
                                    rowList.add(record);
                                }
                            }

                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }

                    return rowList.iterator();
                }, encoder);

        data.show();

        // product analysis
        Dataset<Row> productAnalysisView = data
                .filter("action = 'view'")
                .groupBy("time", "product_id")
                .agg(count("*").as("view"));

        Dataset<Row> productAnalysisPurchase = data
                .filter("action = 'purchase'")
                .groupBy("time", "product_id")
                .agg(count("*").as("purchase"));

        Dataset<Row> productAnalysisRevenue = data
                .withColumn("revenue", col("quantity").multiply(col("price")))
                .filter("action = 'purchase'")
                .groupBy("time", "product_id")
                .agg(sum("revenue").as("total_revenue"));

        Dataset<Row> productAnalysis = productAnalysisView
                .join(productAnalysisPurchase, JavaConverters.asScalaBuffer(Arrays.asList("time", "product_id")).seq(), "outer")
                .join(productAnalysisRevenue, JavaConverters.asScalaBuffer(Arrays.asList("time", "product_id")).seq(), "outer");

        productAnalysis.show();

        List<Row> productAnalysisList = productAnalysis.collectAsList();
        MysqlService mysqlService = new MysqlService();
        for (Row row : productAnalysisList) {
            long time = row.getLong(0);
            int productId = row.getInt(1);
            long numView = row.getAs(2) == null ? 0 : row.getLong(2);
            long numPurchase = row.getAs(3) == null ? 0 : row.getLong(3);
            long revenue = row.getAs(4) == null ? 0 : row.getLong(4);

            mysqlService.insertProductAnalysis(time, productId, numView, numPurchase, revenue);
        }

        // cateogry analysis
        Dataset<Row> categoryAnalysisView = data
                .filter("action = 'view'")
                .groupBy("time", "category_id")
                .agg(count("*").as("view"));

        Dataset<Row> categoryAnalysisPurchase = data
                .filter("action = 'purchase'")
                .groupBy("time", "category_id")
                .agg(count("*").as("purchase"));

        Dataset<Row> categoryAnalysisRevenue = data
                .withColumn("revenue", col("quantity").multiply(col("price")))
                .filter("action = 'purchase'")
                .groupBy("time", "category_id")
                .agg(sum("revenue").as("total_revenue"));

        Dataset<Row> categoryAnalysis = categoryAnalysisView
                .join(categoryAnalysisPurchase, JavaConverters.asScalaBuffer(Arrays.asList("time", "category_id")).seq(), "outer")
                .join(categoryAnalysisRevenue, JavaConverters.asScalaBuffer(Arrays.asList("time", "category_id")).seq(), "outer");

        categoryAnalysis.show();

        List<Row> categoryAnalysisList = categoryAnalysis.collectAsList();
        for (Row row : categoryAnalysisList) {
            long time = row.getLong(0);
            int categoryId = row.getInt(1);
            long numView = row.getAs(2) == null ? 0 : row.getLong(2);
            long numPurchase = row.getAs(3) == null ? 0 : row.getLong(3);
            long revenue = row.getAs(4) == null ? 0 : row.getLong(4);

            mysqlService.insertCategoryAnalysis(time, categoryId, numView, numPurchase, revenue);
        }

        // range_analysis
        Dataset<Row> dataRange = data
                .withColumn("range", when(col("price").lt(100000), "0 - 100000")
                        .when(col("price").geq(100000).and(col("price").lt(300000)), "100000 - 300000")
                        .when(col("price").geq(300000).and(col("price").lt(500000)), "300000 - 500000")
                        .otherwise(">= 500000"));
        Dataset<Row> rangeAnalysisView = dataRange
                .filter("action = 'view'")
                .groupBy("time", "range")
                .agg(count("*").as("view"));

        Dataset<Row> rangeAnalysisPurchase = dataRange
                .filter("action = 'purchase'")
                .groupBy("time", "range")
                .agg(count("*").as("purchase"));

        Dataset<Row> rangeAnalysisRevenue = dataRange
                .withColumn("revenue", col("quantity").multiply(col("price")))
                .filter("action = 'purchase'")
                .groupBy("time", "range")
                .agg(sum("revenue").as("total_revenue"));

        Dataset<Row> rangeAnalysis = rangeAnalysisView
                .join(rangeAnalysisPurchase, JavaConverters.asScalaBuffer(Arrays.asList("time", "range")).seq(), "outer")
                .join(rangeAnalysisRevenue, JavaConverters.asScalaBuffer(Arrays.asList("time", "range")).seq(), "outer");

        rangeAnalysis.show();

        List<Row> rangeAnalysisList = rangeAnalysis.collectAsList();
        for (Row row : rangeAnalysisList) {
            long time = row.getLong(0);
            String range = row.getString(1);
            long numView = row.getAs(2) == null ? 0 : row.getLong(2);
            long numPurchase = row.getAs(3) == null ? 0 : row.getLong(3);
            long revenue = row.getAs(4) == null ? 0 : row.getLong(4);

            mysqlService.insertRangeAnalysis(time, range, numView, numPurchase, revenue);
        }

    }


    /**
     * @param df
     */
    public void viewAnalysis(Dataset<Row> df) {
        Dataset<Row> data = df.filter("event = 'page_view'");

        Dataset<Row> result = data.groupBy("time")
                .agg(countDistinct("user_id").as("num_user"),
                        count("*").as("count_view"));
        result.show();

        List<Row> rowList = result.collectAsList();
        MysqlService mysqlService = new MysqlService();
        for (Row row : rowList) {
            long time = row.getLong(0);
            long numUser = row.getLong(1);
            long numView = row.getLong(2);

            mysqlService.insertViewAnalysis(time, numUser, numView);
        }
    }

    /**
     * @param df
     */
    public void locationAnalysis(Dataset<Row> df) {
        Dataset<Row> data = df.filter("event = 'page_view'");

        Dataset<Row> result = data.groupBy("time", "geo-city")
                .agg(countDistinct("user_id").as("num_user"),
                        count("*").as("count_view"));
        result.show();

        List<Row> rowList = result.collectAsList();
        MysqlService mysqlService = new MysqlService();
        for (Row row : rowList) {
            long time = row.getLong(0);
            String location = row.getString(1);
            long numUser = row.getLong(2);
            long numView = row.getLong(3);

            mysqlService.insertLocationAnalysis(time, location, numUser, numView);
        }
    }

    /**
     * Chuẩn hóa và bổ sung thông tin cho trường còn thiếu
     *
     * @return
     */
    public Dataset<Row> preProcess(Dataset<Row> df) {
        // chuẩn hóa time về cùng 1 giơ trong ngày
        spark.udf().register("parseTime", (UDF1<Long, Long>) DateTimeUtils::getCeilTime, DataTypes.LongType);
        Dataset<Row> data = df.withColumn("time", call_udf("parseTime", col("dvce_created_tstamp")));

        // bổ sung thông tin cho trường user_id
        StructType schema = new StructType()
                .add("user_id", DataTypes.StringType, false)
                .add("domain_userid", DataTypes.StringType, false);
        ExpressionEncoder<Row> encoder = RowEncoder.apply(schema);

        WindowSpec windowSpec = Window.partitionBy("domain_userid").orderBy(col("user_id").desc());
        Dataset<Row> filter = df
                .select("user_id", "domain_userid")
                .distinct()
                .withColumn("rank", row_number().over(windowSpec))
                .filter("rank = 1");
        filter.show();

        Dataset<Row> mapping = filter
                .repartition(20)
                .mapPartitions((MapPartitionsFunction<Row, Row>) t -> {
                    List<Row> rowList = new ArrayList<>();
                    MysqlService mysqlService = new MysqlService();

                    while (t.hasNext()) {
                        Row row = t.next();

                        try {
                            String user_id = row.getString(0);
                            String domain_userid = row.getString(1);

                            if (user_id.equals("")) {
                                user_id = String.valueOf(mysqlService.getUserId(domain_userid));

                                if (user_id.equals("-1")) {
                                    user_id = domain_userid;
                                }
                            }

                            System.out.println("user_id: " + user_id + "\tdomain_userid: " + domain_userid);

                            rowList.add(RowFactory.create(user_id, domain_userid));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }

                    return rowList.iterator();
                }, encoder)
                .distinct();

        data.show();
        mapping.show();

        data = data
                .drop("user_id")
                .join(mapping, JavaConverters.asScalaBuffer(Collections.singletonList("domain_userid")).seq());

        return data;
    }

    public void run() {
        String path = "hdfs://hadoop23202:9000/user/phuld/data/event/" + DateTimeUtils.getDate() + "/*";
        System.out.println(path);


        Dataset<Row> data = spark.read().parquet(path);
        System.out.println("num record before: " + data.count());
        data = preProcess(data);
        System.out.println("num record after: " + data.count());


        productAnalysis(data);
        viewAnalysis(data);
        locationAnalysis(data);
    }

    public static void main(String[] args) {
        AggregateData aggregateData = new AggregateData();
        aggregateData.run();
    }
}
