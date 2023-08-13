package org.hust.loader.kafka.elasticsearch;

import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.xcontent.XContentType;
import org.hust.loader.IRecord;
import org.hust.loader.TableName;
import org.hust.loader.record.TrackingActionProduct;
import org.hust.loader.record.TrackingActionSearch;
import org.hust.storage.elasticsearch.ElasticsearchClient;

import java.io.IOException;

/**
 * Insert các event vào graph
 */
public class InsertEs {
    private RestHighLevelClient esClient;

    public InsertEs() {
        esClient = ElasticsearchClient.getEsClient();
    }

    public void insertDocument(IRecord record){
        if (record == null) return;

        IndexRequest request = null;

        if (record instanceof TrackingActionProduct) {
            TrackingActionProduct document = (TrackingActionProduct) record;
            System.out.println(document);

            request = new IndexRequest(TableName.TRACKING_ACTION_PRODUCT);
            request.source(document.toString(), XContentType.JSON);
            System.out.println("insert action product!!");
        } else if (record instanceof TrackingActionSearch) {
            TrackingActionSearch document = (TrackingActionSearch) record;
            System.out.println(document);

            request = new IndexRequest(TableName.TRACKING_ACTION_SEARCH);
            request.source(document.toString(), XContentType.JSON);
            System.out.println("insert action search!!");
        }

        try {
            esClient.index(request, RequestOptions.DEFAULT);
        } catch (IOException ignore) {
        }
    }
}
