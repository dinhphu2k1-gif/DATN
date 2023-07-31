package org.hust.utils;

import org.apache.http.HttpHost;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class HostUtils {
    public static String getKafkaHost() {
        return System.getenv("BOOTSTRAP_SERVERS") == null
                ? "20.214.141.95:9092,52.231.108.82:9092"
                : System.getenv("BOOTSTRAP_SERVERS");
    }

    public static HttpHost[] getEsHost() {
        String addressString = System.getenv("ES_HOSTS");
        if (addressString == null) {

            return new HttpHost[]{
                    new HttpHost("20.214.141.95", 9200, "http")
//                    new HttpHost("52.231.108.82", 9200, "http")
            };
        } else {
            List<String> addressList = Arrays.asList(addressString.split(","));

            List<HttpHost> esHosts = new ArrayList<>();
            for (String address : addressList) {
                String host = address.split(":")[0];
                int port = Integer.parseInt(address.split(":")[1]);

                HttpHost httpHost = new HttpHost(host, port, "http");
                esHosts.add(httpHost);

            }

            return esHosts.toArray(new HttpHost[0]);
        }
    }

    public static String getMysqlHost() {
        return System.getenv("MYSQL_HOST") == null
                ? "52.231.108.82"
                : System.getenv("MYSQL_HOST");
    }
}
