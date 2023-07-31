package org.hust.utils.maxmind;

import com.maxmind.geoip2.DatabaseReader;
import lombok.Getter;
import org.hust.utils.IpLookupUtils;

import java.io.Serializable;

@Getter
public class MaxMindWrapper implements Serializable {
    private transient final DatabaseReader reader;

    public MaxMindWrapper() {
        reader = IpLookupUtils.getReader();
    }

}
