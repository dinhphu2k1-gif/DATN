package org.hust.loader.kafka.mysql;

import org.hust.loader.IInsertRecord;
import org.hust.loader.IRecord;
import org.hust.loader.TableName;
import org.hust.loader.record.TrackingActionProduct;
import org.hust.loader.record.TrackingActionSearch;
import org.hust.model.entity.impl.ProductContext;
import org.hust.storage.mysql.MysqlConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

public class InsertRecord {
    private final static Logger LOGGER = LoggerFactory.getLogger(InsertRecord.class);
    private final static Connection connnection = MysqlConnection.getConnection();

    public static void insertRecord(IRecord record) {
        if (record == null) return;

        if (record instanceof TrackingActionProduct) {
            TrackingActionProduct document = (TrackingActionProduct) record;

            List<ProductContext> productContextList = document.getProduct();
            for (ProductContext productContext : productContextList) {
                try {
                    insertTrackingActionProduct(productContext, document);
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }

        } else if (record instanceof TrackingActionSearch) {
            TrackingActionSearch document = (TrackingActionSearch) record;
            try {
                insertTrackingActionSearch(document);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public static void insertTrackingActionProduct(ProductContext productContext, TrackingActionProduct record) throws SQLException {
        String query = "INSERT INTO " +
                TableName.TRACKING_ACTION_PRODUCT +
                " (time, date, event_id, user_id, domain_userid, action, extra, product_id, quantity, price, category_id, publisher_id, author_id) " +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        PreparedStatement preparedStatement = connnection.prepareStatement(query);
        preparedStatement.setLong(1, record.getTime());
        preparedStatement.setTimestamp(2, Timestamp.valueOf(record.getDate()));
        preparedStatement.setString(3, record.getEvent_id());
        preparedStatement.setInt(4, record.getUser_id());
        preparedStatement.setString(5, record.getDomain_userid());
        preparedStatement.setString(6, record.getAction());
        preparedStatement.setString(7, record.getExtra());
        preparedStatement.setInt(8, productContext.getProduct_id());
        preparedStatement.setInt(9, productContext.getQuantity());
        preparedStatement.setInt(10, productContext.getPrice());
        preparedStatement.setInt(11, productContext.getCategory_id());
        preparedStatement.setInt(12, productContext.getPublisher_id());
        preparedStatement.setInt(13, productContext.getAuthor_id());


        if (preparedStatement.executeUpdate() == 1) {
            System.out.println("insert mysql!!");
        }
    }

    public static void insertTrackingActionSearch(TrackingActionSearch record) throws SQLException {
        String query = "INSERT INTO " +
                TableName.TRACKING_ACTION_SEARCH +
                " (time, date, event_id, user_id, domain_userid, action, search_value) " +
                " VALUES (?, ?, ?, ?, ?, ?, ?)";
        PreparedStatement preparedStatement = connnection.prepareStatement(query);

        preparedStatement.setLong(1, record.getTime());
        preparedStatement.setTimestamp(2, Timestamp.valueOf(record.getDate()));
        preparedStatement.setString(3, record.getEvent_id());
        preparedStatement.setInt(4, record.getUser_id());
        preparedStatement.setString(5, record.getDomain_userid());
        preparedStatement.setString(6, record.getAction());
        preparedStatement.setString(7, record.getSearch_value());

        if (preparedStatement.execute()) {
            System.out.println("insert mysql!!");
        }
    }
}
