package org.hust.service.mysql;

import org.hust.storage.mysql.MysqlConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;

public class MysqlService {
    private final Connection connection;
    private final static Logger LOGGER = LoggerFactory.getLogger(MysqlService.class);

    public MysqlService() {
        connection = MysqlConnection.getConnection();
    }

    public void close() {
        MysqlConnection.close();
    }

    public boolean checkExistMapping(int user_id, String domain_userid) {
        String sql = "SELECT * FROM cdp_mapping WHERE domain_userid = ? and user_id = ?";

        boolean exist = false;
        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, domain_userid);
            statement.setInt(2, user_id);

            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                exist = true;
            }

            statement.close();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }

        return exist;
    }

    public void insertMapping(int user_id, String domain_userid) {
        String sql = "INSERT INTO cdp_mapping (domain_userid, user_id, create_at) VALUES (?, ?, ?)";

        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, domain_userid);
            statement.setInt(2, user_id);
            statement.setTimestamp(3, new Timestamp(System.currentTimeMillis() + 7 * 3600 * 1000));

            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    public int getUserId(String domain_userid) {
        String sql = "SELECT user_id FROM cdp_mapping WHERE domain_userid = ?";

        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, domain_userid);

            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                return resultSet.getInt("user_id");
            }

            statement.close();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }

        return -1;
    }

    public void deleteProductAnalysis(long time, int productId) {
        String sql = "DELETE FROM product_analysis WHERE time = ? and product_id = ?";

        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setTimestamp(1, new Timestamp(time + 7 * 3600 * 1000));
            statement.setInt(2, productId);

            // Execute the SQL statement
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    public void insertProductAnalysis(long time, int productId, long numView, long numPurchase, long revenue) {
        // xóa các giá trị cũ đi
        deleteProductAnalysis(time, productId);

        // chèn giá trị mới vào
        String sql = "INSERT INTO product_analysis (time, product_id, view, purchase, revenue) VALUES (?, ?, ?, ?, ?)";

        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setTimestamp(1, new Timestamp(time + 7 * 3600 * 1000));
            statement.setInt(2, productId);
            statement.setInt(3, (int) numView);
            statement.setInt(4, (int) numPurchase);
            statement.setInt(5, (int) revenue);

            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    public void deleteCategoryAnalysis(long time, int categoryId) {
        String sql = "DELETE FROM category_analysis WHERE time = ? and category_id = ?";

        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setTimestamp(1, new Timestamp(time + 7 * 3600 * 1000));
            statement.setInt(2, categoryId);

            // Execute the SQL statement
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    public void insertCategoryAnalysis(long time, int categoryId, long numView, long numPurchase, long revenue) {
        // xóa các giá trị cũ đi
        deleteCategoryAnalysis(time, categoryId);

        // chèn giá trị mới vào
        String sql = "INSERT INTO category_analysis (time, category_id, view, purchase, revenue) VALUES (?, ?, ?, ?, ?)";

        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setTimestamp(1, new Timestamp(time + 7 * 3600 * 1000));
            statement.setInt(2, categoryId);
            statement.setInt(3, (int) numView);
            statement.setInt(4, (int) numPurchase);
            statement.setInt(5, (int) revenue);

            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    public void deleteRangeAnalysis(long time, String range) {
        String sql = "DELETE FROM value_analysis WHERE time = ? and range_value = ?";

        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setTimestamp(1, new Timestamp(time + 7 * 3600 * 1000));
            statement.setString(2, range);

            // Execute the SQL statement
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    public void insertRangeAnalysis(long time, String range, long numView, long numPurchase, long revenue) {
        // xóa các giá trị cũ đi
        deleteRangeAnalysis(time, range);

        // chèn giá trị mới vào
        String sql = "INSERT INTO value_analysis (time, range_value, view, purchase, revenue) VALUES (?, ?, ?, ?, ?)";

        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setTimestamp(1, new Timestamp(time + 7 * 3600 * 1000));
            statement.setString(2, range);
            statement.setInt(3, (int) numView);
            statement.setInt(4, (int) numPurchase);
            statement.setInt(5, (int) revenue);

            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    public void deleteViewAnalysis(long time) {
        String sql = "DELETE FROM view_analysis WHERE time = ? ";

        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setTimestamp(1, new Timestamp(time + 7 * 3600 * 1000));

            // Execute the SQL statement
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    public void insertViewAnalysis(long time, long numUser, long numView) {
        deleteViewAnalysis(time);

        String sql = "INSERT INTO view_analysis (time, user, view) VALUES (?, ?, ?)";

        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setTimestamp(1, new Timestamp(time + 7 * 3600 * 1000));
            statement.setInt(2, (int) numUser);
            statement.setInt(3, (int) numView);

            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    public void deleteLocationAnalysis(long time, String locaiton) {
        String sql = "DELETE FROM location_analysis WHERE time = ? and location = ?";

        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setTimestamp(1, new Timestamp(time + 7 * 3600 * 1000));
            statement.setString(2, locaiton);

            // Execute the SQL statement
            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    public void insertLocationAnalysis(long time, String location, long numUser, long numView) {
        deleteLocationAnalysis(time, location);

        String sql = "INSERT INTO location_analysis (time, location, user, view) VALUES (?, ?, ?, ?)";

        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setTimestamp(1, new Timestamp(time + 7 * 3600 * 1000));
            statement.setString(2, location);
            statement.setInt(3, (int) numUser);
            statement.setInt(4, (int) numView);

            statement.executeUpdate();
            statement.close();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }


    public static void main(String[] args) {
        MysqlService mysqlService = new MysqlService();

//        System.out.println(mysqlService.checkExistMapping(1, "123"));
//        mysqlService.insertMapping(1, "1234");
        System.out.println(mysqlService.getUserId("5a8ee00c-98e0-4acc-bbfc-306e37808d0b"));
        mysqlService.close();
    }
}
