package org.hust.loader;

import org.hust.loader.record.TrackingActionProduct;
import org.hust.loader.record.TrackingActionSearch;
import org.hust.model.entity.IContext;
import org.hust.model.entity.impl.ProductContext;
import org.hust.model.entity.impl.UserContext;
import org.hust.model.event.Event;
import org.hust.model.event.unstruct.IUnstructEvent;
import org.hust.model.event.unstruct.impl.ProductAction;
import org.hust.model.event.unstruct.impl.SearchAction;

import java.util.ArrayList;
import java.util.List;

public interface IRecord {

    static IRecord createRecord(Event event){
        List<IContext> contextList = IContext.createContext(event);
        IUnstructEvent unstructEvent = IUnstructEvent.createEvent(event);

        List<ProductContext> productContextList = new ArrayList<>();
        UserContext userContext = null;

        for (IContext context : contextList) {
            if (context instanceof ProductContext) {
                ProductContext productContext = (ProductContext) context;
                productContextList.add(productContext);
            } else if (context instanceof UserContext) {
                userContext = (UserContext) context;
            }
        }

        IRecord record = null;
        if (unstructEvent instanceof ProductAction) {
            record = new TrackingActionProduct(event, productContextList, userContext, (ProductAction) unstructEvent);
        } else if (unstructEvent instanceof SearchAction) {
            record = new TrackingActionSearch(event, userContext, (SearchAction) unstructEvent);
        }

        return record;

    }

}
