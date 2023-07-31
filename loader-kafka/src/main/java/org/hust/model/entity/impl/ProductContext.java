package org.hust.model.entity.impl;

import lombok.Getter;
import org.hust.model.entity.IContext;
import org.json.JSONObject;

/**
 * Product context
 */
@Getter
public class ProductContext implements IContext {
    private int product_id;
    private String product_name;
    private int quantity;
    private int price;
    private int category_id;
    private int publisher_id;
    private int author_id;

    public ProductContext(JSONObject data) {
        parseContext(data);
    }

    @Override
    public void parseContext(JSONObject data) {
        product_id = data.getInt("product_id");
        product_name = data.getString("product_name");
        quantity = data.getInt("quantity");
        price = data.getInt("price");
        category_id = data.getInt("category_id");
        publisher_id = data.getInt("publisher_id");
        author_id = data.getInt("author_id");
    }
}
