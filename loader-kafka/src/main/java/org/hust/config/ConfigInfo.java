package org.hust.config;

import org.apache.http.HttpHost;
import org.hust.utils.HostUtils;

public final class ConfigInfo {

    public static class Elasticsearch {
        public static final HttpHost[] ES_HOST = HostUtils.getEsHost();
    }

    public static class Kafka {
        public final static String KAFKA_HOST = HostUtils.getKafkaHost();
    }

    public static class Mysql {
        public final static String MYSQL_HOST = HostUtils.getMysqlHost();
        public final static String MYSQL_PORT = "3306";
        public final static String MYSQL_DATABASE = "customer-data-platform";
        public final static String MYSQL_USER = "book_shop";
        public final static String MYSQL_PASSWORD = "package1107N";
    }

    public final static String GEOLITE2_CITY = "properties/GeoLite2-City.mmdb";
}
