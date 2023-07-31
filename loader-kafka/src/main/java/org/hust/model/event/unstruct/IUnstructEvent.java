package org.hust.model.event.unstruct;

import org.hust.model.Schema;
import org.hust.model.event.Event;
import org.hust.model.event.unstruct.impl.ProductAction;
import org.hust.model.event.unstruct.impl.SearchAction;
import org.json.JSONObject;

public interface IUnstructEvent {
    static IUnstructEvent createEvent(Event event) {
        JSONObject unstruct_event = new JSONObject(event.getUnstruct_event()).getJSONObject("data");
        String schema = unstruct_event.getString("schema");
        JSONObject data = unstruct_event.getJSONObject("data");

        String schema_name = new Schema(schema).getName();
        switch (schema_name) {
            case UnstructType.PRODUCT_ACTION:
                return new ProductAction(data);
            case UnstructType.SEARCH_ACTION:
                return new SearchAction(data);
        }

        return null;
    }

    static IUnstructEvent createEvent(String dataUnstruct) {
        JSONObject unstruct_event = new JSONObject(dataUnstruct).getJSONObject("data");
        String schema = unstruct_event.getString("schema");
        JSONObject data = unstruct_event.getJSONObject("data");

        String schema_name = new Schema(schema).getName();
        switch (schema_name) {
            case UnstructType.PRODUCT_ACTION:
                return new ProductAction(data);
            case UnstructType.SEARCH_ACTION:
                return new SearchAction(data);
        }

        return null;
    }

    /**
     * Tách thông tin trong event
     * @param data
     */
    void parseEvent(JSONObject data);
}
