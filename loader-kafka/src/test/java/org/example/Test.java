package org.example;


import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.exception.GeoIp2Exception;
import com.maxmind.geoip2.model.CityResponse;
import com.maxmind.geoip2.record.City;
import com.maxmind.geoip2.record.Country;
import com.maxmind.geoip2.record.Location;
import org.hust.config.ConfigInfo;
import org.hust.utils.IpLookupUtils;

import java.io.File;
import java.io.IOException;
import java.net.InetAddress;

public class Test {
    public static void main(String[] args) throws IOException, GeoIp2Exception {
        String ipAddress = "116.99.7.x"; // Replace with the IP address you want to retrieve the address for
        File database = new File("/home/phukaioh/DATN/snowplow/loader-kafka/src/main/resources/GeoLite2-City.mmdb");
        DatabaseReader reader = new DatabaseReader.Builder(database).build();

        InetAddress inetAddress = InetAddress.getByName(ipAddress);
        CityResponse response = reader.city(inetAddress);
        System.out.println(response.getRepresentedCountry());
    }
}
