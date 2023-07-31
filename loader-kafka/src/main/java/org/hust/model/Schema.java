package org.hust.model;

import lombok.Getter;

/**
 * Schema định nghĩa trong iglu server
 * <br>
 * <a href="https://docs.snowplow.io/docs/understanding-tracking-design/understanding-schemas-and-validation/">Struct schema</a>
 */
@Getter
public class Schema {
    /**
     * Tổ chức viết schema
     */
    private String vendor;
    /**
     * Tên schema
     */
    private String name;
    /**
     * Mặc định lúc nào cx là "jsonschema"
     */
    private String format = "jsonschema";
    /**
     * Phiên bản
     */
    private String version;

    public Schema(String schema) {
        parseSchema(schema);
    }

    /**
     * Tách chuỗi
     * @param schema
     */
    public void parseSchema(String schema) {
        String[] arr = schema.split(":")[1].split("/");
        vendor = arr[0];
        name = arr[1];
        format = arr[2];
        version = arr[3];
    }

    public static void main(String[] args) {
        System.out.println(new Schema("iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1").getName());
    }
}
