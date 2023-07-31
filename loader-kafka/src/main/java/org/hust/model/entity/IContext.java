package org.hust.model.entity;

import org.hust.model.Schema;
import org.hust.model.entity.impl.ProductContext;
import org.hust.model.entity.impl.UserContext;
import org.hust.model.event.Event;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public interface IContext {
    /**
     * Khởi tạo 1 context
     * @param contextType loại context
     * @param data dữ liệu của context
     * @return context sau khi khởi tạo
     */
    static IContext createContext(String contextType, JSONObject data) {
        switch (contextType) {
            case ContextType.USER_CONTEXT:
                return new UserContext(data);
            case ContextType.PRODUCT_CONTEXT:
                return new ProductContext(data);
        }

        return null;
    }

    /**
     * Tách thông tin từ context
     * @param data dữ liệu trong context
     */
    void parseContext(JSONObject data);

    /**
     * Lấy danh sách các context xuất hiện trong event
     * @param event event được gửi từ kafka
     * @return danh sách context
     */
    static List<IContext> createContext(Event event) {
        List<IContext> contextList =new ArrayList<>();

        JSONObject contexts = new JSONObject(event.getContexts());
        JSONArray data = contexts.getJSONArray("data");

        for (int i = 0; i < data.length(); i++) {
            JSONObject context = data.getJSONObject(i);
            String schema = context.getString("schema");

            String schema_name = new Schema(schema).getName();
            contextList.add(IContext.createContext(schema_name, context.getJSONObject("data")));
        }

        return contextList;
    }

    /**
     *  Lấy danh sách các context xuất hiện trong event
     * @param dataContexts dữ liệu context
     * @return danh sách context
     */
    static List<IContext> createContext(String dataContexts) {
        List<IContext> contextList =new ArrayList<>();

        JSONObject contexts = new JSONObject(dataContexts);
        JSONArray data = contexts.getJSONArray("data");

        for (int i = 0; i < data.length(); i++) {
            JSONObject context = data.getJSONObject(i);
            String schema = context.getString("schema");

            String schema_name = new Schema(schema).getName();
            contextList.add(IContext.createContext(schema_name, context.getJSONObject("data")));
        }

        return contextList;
    }




}
