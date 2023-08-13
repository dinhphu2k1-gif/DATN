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
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

public class Test {
    public static void main(String[] args) throws IOException, GeoIp2Exception {
        ExecutorService executorService = Executors.newCachedThreadPool();
        AtomicLong threadId = new AtomicLong();
        Future<String> future = executorService.submit(() -> {
            threadId.set(Thread.currentThread().getId());

            for (int i = 0; i < 10000; i++) {
                System.out.println("i = " + i);
            }

            return "ok";
        });

        try {
            future.get(1, TimeUnit.MICROSECONDS);
        } catch (Exception e) {
            Set<Thread> setOfThread = Thread.getAllStackTraces().keySet();
            for (Thread thread : setOfThread) {
                if (thread.getId() == threadId.get()) {
//                    thread.interrupt();
                    thread.suspend();
                    thread.stop();
                    thread.destroy();
                    System.out.println("\nkill thread: " + threadId.get());
                }
            }

        }

        executorService.shutdown();
    }
}
