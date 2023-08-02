#!/bin/bash

# the default node number is 3
N=${1:-3}


# start hadoop master container
sudo docker rm -f hadoop-master &> /dev/null
echo "start hadoop-master container..."
sudo docker run -itd \
                --net=snowplow \
                -p 9870:9870 \
                -p 8088:8088 \
				-p 4040:4040 \
				-p 18080:18080 \
				-p 9000:9000 \
				--ip 172.19.0.20 \
                --name hadoop-master \
                --hostname hadoop-master \
                dinhphu/hadoop-spark:1.0.0 &> /dev/null


# start hadoop slave container
i=1
while [ $i -lt $N ]
do
	sudo docker rm -f hadoop-slave$i &> /dev/null
	echo "start hadoop-slave$i container..."
	sudo docker run -itd \
					--net=snowplow \
					--ip 172.19.0.2$i \
	                --name hadoop-slave$i \
	                --hostname hadoop-slave$i \
	                dinhphu/hadoop-spark:1.0.0 &> /dev/null
	i=$(( $i + 1 ))
done 

# get into hadoop master container
sudo docker exec -it hadoop-master bash
