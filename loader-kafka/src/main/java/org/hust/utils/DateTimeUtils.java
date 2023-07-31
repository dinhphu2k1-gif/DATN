package org.hust.utils;

import org.joda.time.DateTime;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateTimeUtils implements Serializable {
    public static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy_MM_dd");
    public static final SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy_MM_dd/HH_mm_ss");
    public static final SimpleDateFormat dateTimeMysql = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    /**
     * Mặc định là ngày hôm nay
     */
    public static String getDate() {
        return dateFormat.format(new Date().getTime() + 7 * 3600 * 1000);
    }

    public static String getDate(long time) {
        return dateFormat.format(new Date(time));
    }

    /**
     * Mặc định là ngày hôm nay
     */
    public static String getDateTime() {
        return dateTimeFormat.format(new Date());
    }

    public static String getDateTime(long time) {
        return dateTimeFormat.format(new Date(time));
    }

    public static long getCeilTime(long time) {
        DateTime dateTime = new DateTime(time);
        int hour = dateTime.getHourOfDay();
        DateTime newDateTime = dateTime.withTimeAtStartOfDay().plusHours(hour);

        return newDateTime.getMillis();
    }

    public static void main(String[] args) {
        DateTime dateTime = new DateTime(1689347267168L);
        int hour = dateTime.getHourOfDay();
        DateTime newDateTime = dateTime.withTimeAtStartOfDay().plusHours(hour);
        System.out.println(dateTimeMysql.format(newDateTime.toDate()));
        System.out.println(newDateTime.getMillis());
    }
}
