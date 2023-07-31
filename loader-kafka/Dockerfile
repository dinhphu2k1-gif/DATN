FROM ubuntu:20.04

# install java
RUN apt-get update && apt-get install -y  openjdk-8-jdk

WORKDIR /loader-kafka

ADD . /loader-kafka

ENTRYPOINT [ "java", "-cp", "target/loader-kafka-1.0-SNAPSHOT-jar-with-dependencies.jar", "org.hust.loader.kafka.CollectEvent" ]