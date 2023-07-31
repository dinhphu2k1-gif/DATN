package org.hust.utils;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.model.CityResponse;
import com.maxmind.geoip2.record.Location;
import org.hust.config.ConfigInfo;

import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.net.InetAddress;

public class IpLookupUtils implements Serializable {
    private static DatabaseReader reader;

    public static void initReader() {
        if (reader == null) {
            synchronized (IpLookupUtils.class) {
                if (reader == null) {
                    File database = new File(ConfigInfo.GEOLITE2_CITY);
//                    File database = new File("/home/dinhphu/Documents/snowplow/loader-kafka/src/main/resources/GeoLite2-City.mmdb");
                    try {
                        reader = new DatabaseReader.Builder(database).build();
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
    }

    public static DatabaseReader getReader() {
        initReader();

        return reader;
    }

    public enum Type {
        COUNTRY,
        CITY,
        ZIP_CODE,
        LATITUDE,
        LONGTITUDE
    }

    public static String convertIpTo(Type type, String ipAddress) {
        initReader();

        switch (type) {
            case COUNTRY:
                return getCountry(ipAddress);
            case CITY:
                return getCity(ipAddress);
            case ZIP_CODE:
                return getZipcode(ipAddress);
            case LATITUDE:
                return getLatitude(ipAddress);
            case LONGTITUDE:
                return getLongitude(ipAddress);
            default:
                return null;
        }
    }

    /**
     * Lấy tên quốc gia từ ip
     */
    public static String getCountry(String ipAddress) {
        try {
            InetAddress inetAddress = InetAddress.getByName(ipAddress);
            CityResponse response = reader.city(inetAddress);

            return response.getCountry().getName();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    /**
     * Lấy tên thành phố từ ip
     *
     * @return
     */
    public static String getCity(String ipAddress) {
        try {
            InetAddress inetAddress = InetAddress.getByName(ipAddress);
            CityResponse response = reader.city(inetAddress);

            return response.getCity().getName();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public static String getZipcode(String ipAddress) {
        try {
            InetAddress inetAddress = InetAddress.getByName(ipAddress);
            CityResponse response = reader.city(inetAddress);

            return response.getPostal().getCode();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public static String getLatitude(String ipAddress) {
        try {
            InetAddress inetAddress = InetAddress.getByName(ipAddress);
            CityResponse response = reader.city(inetAddress);

            Location location = response.getLocation();

            return String.valueOf(location.getLatitude());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public static String getLongitude(String ipAddress) {
        try {
            InetAddress inetAddress = InetAddress.getByName(ipAddress);
            CityResponse response = reader.city(inetAddress);

            Location location = response.getLocation();

            return String.valueOf(location.getLongitude());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public static void main(String[] args) {
        System.out.println(IpLookupUtils.convertIpTo(Type.CITY, "116.99.33.1"));
    }
}
