/opt/spark320/bin/spark-submit --master yarn  --deploy-mode client \
--num-executors 2 --executor-memory 1g --executor-cores 2 \
--keytab /home/phuld/phuld_platform.keytab --principal phuld/platform@HADOOP.SECURE \
--queue datamining \
--files=./properties/GeoLite2-City.mmdb \
--conf spark.streaming.kafka.allowNonConsecutiveOffsets=true \
--class org.hust.job.JobsManager target/loader-kafka-1.0-SNAPSHOT-jar-with-dependencies.jar  \
--job CollectEvent --duration $1 --groupId $2 --topics $3