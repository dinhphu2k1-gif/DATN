package org.hust.utils;

import lombok.Getter;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.hust.config.ConfigInfo;

import java.util.*;

@Getter
public class KafkaUtils {
    private Map<String, Object> kafkaParams;
    private final Collection<String> topics;

    public KafkaUtils(String groupId, String... topics) {
        kafkaParams = new HashMap<>();

        kafkaParams.put("bootstrap.servers", ConfigInfo.Kafka.KAFKA_HOST);
        kafkaParams.put("key.deserializer", StringDeserializer.class);
        kafkaParams.put("value.deserializer", StringDeserializer.class);
        kafkaParams.put("group.id", groupId);
        kafkaParams.put("auto.offset.reset", "latest");
        kafkaParams.put("enable.auto.commit", false);

        this.topics = Arrays.asList(topics);
    }

    public KafkaUtils(String groupId, Collection<String> topics) {
        kafkaParams = new HashMap<>();

        kafkaParams.put("bootstrap.servers", ConfigInfo.Kafka.KAFKA_HOST);
        kafkaParams.put("key.deserializer", StringDeserializer.class);
        kafkaParams.put("value.deserializer", StringDeserializer.class);
        kafkaParams.put("group.id", groupId);
        kafkaParams.put("auto.offset.reset", "latest");
        kafkaParams.put("enable.auto.commit", false);

        this.topics = topics;
    }
}
