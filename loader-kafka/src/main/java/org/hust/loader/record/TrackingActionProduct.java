package org.hust.loader.record;

import com.google.gson.Gson;
import lombok.Getter;
import org.hust.loader.IRecord;
import org.hust.model.entity.impl.ProductContext;
import org.hust.model.entity.impl.UserContext;
import org.hust.model.event.Event;
import org.hust.model.event.unstruct.impl.ProductAction;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Lưu lại cac sự kiện xảy ra với sản phẩm
 */
@Getter
public class TrackingActionProduct implements IRecord {
    /**
     * Thời gian xảy ra sự kiện. VD 1684418681417
     */
    private long time;
    /**
     * Thòi gian xảy ra sự kiện. VD 18-05-2023 21:26:30
     */
    private String date;
    /**
     * id của sự kiện
     */
    private String event_id;
    /**
     * id của user, do trang web định danh
     */
    private int user_id;
    /**
     * id cuả user, do snowplow định danh
     */
    private String domain_userid;
    /**
     * Hành động liên quan đến sản phẩm
     */
    private String action;
    /**
     * Chứa thông tin thêm về action
     */
    private String extra;
    /**
     * Sản phẩm liên quan đến sự kiện
     */
    private List<ProductContext> product;

    public TrackingActionProduct(Event event, List<ProductContext> productContext, UserContext userContext, ProductAction productAction) {
        time = event.getDvce_created_tstamp() + 25200 * 1000;
        date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(time));
        event_id = event.getEvent_id();
        user_id = userContext.getUser_id();
        domain_userid = event.getDomain_userid();
        action = productAction.getAction();
        extra = productAction.getExtra();
        product = productContext;
    }

    @Override
    public String toString() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }
}
