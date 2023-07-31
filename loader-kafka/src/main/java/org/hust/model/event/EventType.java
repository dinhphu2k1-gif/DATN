package org.hust.model.event;

/**
 * Tên các sự kiện xảy ra
 */
public class EventType {
    /**
     * Theo dõi số lần xem trang, được sử dụng để ghi lại số lần xem các trang web.
     */
    public final static String PAGE_VIEW = "page_view";
    /**
     * Ping trang được sử dụng để ghi lại người dùng tương tác với nội dung trên trang web sau khi trang được tải ban đầu.
     * Ví dụ: nó có thể được sử dụng để theo dõi xem người dùng cuộn xuống một bài viết bao xa.
     */
    public final static String PAGE_PING = "page_ping";
    /**
     * Chứa data do người dùng tự định nghĩa
     */
    public final static String UNSTRUCT = "unstruct";
}
