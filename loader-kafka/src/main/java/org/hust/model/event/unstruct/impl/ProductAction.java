package org.hust.model.event.unstruct.impl;

import lombok.Getter;
import org.hust.model.event.unstruct.IUnstructEvent;
import org.json.JSONObject;

/**
 * Các hành đông liên quan đến 1 sản phẩm
 */
@Getter
public class ProductAction implements IUnstructEvent {
    private String action;
    /**
     * Mặc định là null, do k phải event nào cx có trường này
     */
    private String extra = null;

    public ProductAction(JSONObject data) {
        parseEvent(data);
    }

    @Override
    public void parseEvent(JSONObject data) {
        action = data.getString("action");

        try {
            extra = data.getString("extra");
        } catch (Exception ignore) {
        }
    }
}
