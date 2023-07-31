package org.hust.storage.elasticsearch;

import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.hust.config.ConfigInfo;

import java.io.IOException;

/**
 * Khởi tạo connect tới Elasticsearch
 */
public class ElasticsearchClient {
    private static RestHighLevelClient esClient;

    public static void openConnect() {
        if (esClient == null) {
            synchronized (ElasticsearchClient.class) {
                if (esClient == null) {
                    CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
                    credentialsProvider.setCredentials(
                            AuthScope.ANY,
                            new UsernamePasswordCredentials(
                                    "elastic",
                                    "MagicWord")
                    );

                    esClient = new RestHighLevelClient(
                            RestClient
                                    .builder(
                                            ConfigInfo.Elasticsearch.ES_HOST
                                    )
                                    .setHttpClientConfigCallback(httpAsyncClientBuilder -> httpAsyncClientBuilder
                                            .setDefaultCredentialsProvider(credentialsProvider))
                    );
                }
            }
        }
    }

    public static RestHighLevelClient getEsClient() {
        openConnect();
        return esClient;
    }

    public static void close() {
        try {
            esClient.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static void main(String[] args) {
        ElasticsearchClient.getEsClient();
        ElasticsearchClient.close();
    }
}
