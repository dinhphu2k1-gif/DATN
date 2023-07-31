package org.hust.utils;

import lombok.Getter;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.hust.config.ConfigInfo;

@Getter
public class SparkUtils {
    private final SparkSession sparkSession;
    private final JavaSparkContext javaSparkContext;
    private final JavaStreamingContext javaStreamingContext;

    public SparkUtils(String jobName, String master, int duration) {
        sparkSession = SparkSession.builder().appName(jobName)
                .master(master)
                .config("spark.sql.session.timeZone", "UTC+7")
                .config("spark.yarn.access.hadoopFileSystems", "hdfs://" + ConfigInfo.HdfsNamenode.ACTIVE_NAMENODE_HADOOP_23202 + ":9000," +
                        "hdfs://" + ConfigInfo.HdfsNamenode.ACTIVE_NAMENODE_HADOOP_586 + ":9000")
                .getOrCreate();
        sparkSession.sparkContext().setLogLevel("ERROR");

        javaSparkContext = new JavaSparkContext(sparkSession.sparkContext());
        javaStreamingContext = new JavaStreamingContext(javaSparkContext, Durations.seconds(duration));
    }
}
