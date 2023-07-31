package org.hust.model.event.unstruct.impl;

import lombok.Getter;
import org.hust.model.event.unstruct.IUnstructEvent;
import org.json.JSONObject;

/**
 * Hành động tìm kiếm của 1 user
 */
@Getter
public class SearchAction implements IUnstructEvent {
    private String action;
    private String search_value;

    public SearchAction(JSONObject data) {
        parseEvent(data);
    }

    @Override
    public void parseEvent(JSONObject data) {
        action = data.getString("action");
        search_value = data.getString("search_value");
    }
}
