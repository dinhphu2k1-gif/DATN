# Customer-Data-Platform (Data Collection, Organization, and Analysis Module)

## Hướng dẫn cài đặt - Web
Web bán hàng đã được tích hợp vào file `docker-compose.yaml` ở phia dưới

## Hướng dẫn cài đặt - Snowplow
Hệ thống được triển khai trên môi trường docker để dễ dàng deploy nhanh chóng

- Với môi trường chạy test ở Local, chỉ cần chạy file `docker-compose.yaml` ở trong thư mục [snowplow](./snowplow/)

- Với môi trường Azure cloud với 2 máy, thì cần chạy 2 file `machine1.yaml` và `machine2.yaml` ở trong thư mục [snowplow](./snowplow/)

**Note**: khi chạy trên cloud nhớ thay đổi địa chỉ ip cho phù hợp với địa chỉ ip của cloud

## Hướng dẫn cài đặt - Loader
Vào thư mục [loader-kafka](./loader-kafka/) và chạy lệnh

```
bash bin/build.sh
```

để đóng gói mã nguồn thành file .jar phục vụ cho việc chạy trên cụm hadoop

**Note**: nếu chưa có cụm hadoop thì chạy file `start-container` trong thư mục [hadoop-spark](/hadoop-spark/).

Sau khi chạy xong, sẽ đi vào bên trong container `hadoop-master` và chạy file `start-hadoop.sh` để khởi động hadoop

### Streaming Elasticsearch

Sau khi đóng gói mã nguồn, chạy (đây là job Spark)

```
bash bin/run_stream.sh 60 1 enriched
```
 để khởi chạy job streaming elasticsearch (load data vào Elasticsearch mỗi 60s/lần)

### Batch HDFS
 Sau khi đóng gói mã nguồn, chạy (đây là job Spark)

```
bash bin/run_batch.sh 1800 2 enriched
```
 để khởi chạy job Batch HDFS (load data vào HDFS mỗi 30p/lần)

### Job Report
Chạy (đây là job Spark)

```
bash bin/run_report.sh
```
Job sẽ tổng hợp kết quả của ngày hôm nay và lưu vào Mysql


**Note**: khi chạy job trên Spark, có thể  báo lỗi not found file `GeoLite2-City.mmdb`, cần lên [git](https://github.com/dinhphu2k1-gif/DATN) vào thư mục [loader-kafka/properties](./loader-kafka/properties/) để tải file này
