# Customer-Data-Platform (Data Collection, Organization, and Analysis Module)

## Hướng dẫn cài đặt
Các cài đặt sử dụng docker
+ Sử dụng docker. Các file cài đặt docker được build sẵn ở thư mục docker.
+ Có thể thực hiện cài đặt cấu hình địa chỉ các máy chủ ở các file theo từng module.
+ bk.edu.config.Config cho các địa chỉ Kafka, Elastic Search, Airflow
+ resources/application.properties cấu hình địa chỉ cơ sở dữ liệu MySQL
+ constants/api_config cấu hình địa chỉ máy chủ backend module cdp_frontend
+ Cài đặt cụm hadoop-spark
+ Cài đặt airflow kết nối với cụm Hadoop-Spark sử dụng kết nối ssh.
+ Các file Dag có sẵn ở phần docker
+ Tạo trigger cập nhật trường updated_time cho bảng dữ liệu người dùng.
+ Cài đặt module thu thập dữ liệu gồm snowplow, website tracking sự kiện người dùng.

