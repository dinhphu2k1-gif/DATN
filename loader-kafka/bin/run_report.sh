/opt/spark320/bin/spark-submit \
--master yarn  --deploy-mode client \
--num-executors 2 --executor-memory 2g --executor-cores 5 \
--keytab /home/phuld/phuld_platform.keytab --principal phuld/platform@HADOOP.SECURE \
--queue datamining --conf spark.streaming.kafka.allowNonConsecutiveOffsets=true \
--class org.hust.job.report.AggregateData target/loader-kafka-1.0-SNAPSHOT-jar-with-dependencies.jar
