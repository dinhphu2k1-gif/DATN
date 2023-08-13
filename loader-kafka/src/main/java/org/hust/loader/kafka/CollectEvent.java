package org.hust.loader.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.hust.config.ConfigInfo;
import org.hust.loader.IRecord;
import org.hust.model.event.Event;
import org.hust.model.event.EventType;

import java.time.Duration;
import java.util.Collections;
import java.util.Properties;

/**
 * Nhận các event đã được enrich từ Kafka
 */
public class CollectEvent {
    private final KafkaConsumer<String, String> consumer;

    public CollectEvent() {
        Properties props = new Properties();
        props.put("bootstrap.servers", ConfigInfo.Kafka.KAFKA_HOST);
        props.put("group.id", "snowplow123");
        props.put("enable.auto.commit", "false");
        props.put("auto.offset.reset", "latest");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

        consumer = new KafkaConsumer<>(props);
    }

    public void run() {
        consumer.subscribe(Collections.singletonList("enriched"));

        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(1));
            for (ConsumerRecord<String, String> record : records) {
                String value = record.value();
                System.out.println(value);
                Event event = new Event(value);

                switch (event.getEvent()) {
                    case EventType.UNSTRUCT: {
                        IRecord iRecord = IRecord.createRecord(event);
//                        try {
//                            InsertDocument.insertDocument(iRecord);
//                        } catch (Exception e) {
//                            e.printStackTrace();
//                        }

//                        try {
//                            InsertRecord.insertRecord(iRecord);
//                        } catch (Exception e) {
//                            e.printStackTrace();
//                        }

                    }
                    break;
                }
            }
        }

    }

    public static void main(String[] args) {
        CollectEvent collectEvent = new CollectEvent();
        collectEvent.run();
    }
}
