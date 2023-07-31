/opt/spark320/bin/spark-submit --master yarn --deploy-mode client \
--keytab /home/phuld/phuld_platform.keytab --principal phuld/platform@HADOOP.SECURE \
--queue datamining \
--files=./properties/GeoLite2-City.mmdb \
--conf spark.streaming.kafka.allowNonConsecutiveOffsets=true \
--class org.hust.job.JobsManager target/loader-kafka-1.0-SNAPSHOT-jar-with-dependencies.jar  \
--job BatchEvent --duration $1 --groupId $2 --topics $3