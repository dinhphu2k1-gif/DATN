package org.hust.storage.mysql;

import org.hust.config.ConfigInfo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class MysqlConnection {
    private final static String MYSQL_URL = String.format("jdbc:mysql://%s:%s/%s",
            ConfigInfo.Mysql.MYSQL_HOST,
            ConfigInfo.Mysql.MYSQL_PORT,
            ConfigInfo.Mysql.MYSQL_DATABASE);

    private static Connection connection;

    public static void openConnect(){
        if (connection == null) {
            synchronized (MysqlConnection.class) {
                if (connection == null) {
                    try {
                        connection = DriverManager.getConnection(MYSQL_URL,
                                ConfigInfo.Mysql.MYSQL_USER,
                                ConfigInfo.Mysql.MYSQL_PASSWORD);
                    } catch (SQLException e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
    }

    public static Connection getConnection() {
        openConnect();
        return connection;
    }

    public static void close() {
        try {
            connection.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
