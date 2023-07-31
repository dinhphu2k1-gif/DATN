import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import App from './containers/App'
import thunk from 'redux-thunk'
import reducers from './reducers'
import { getUserId } from './config/storage.config';
import storeConfig from "./config/storage.config";

//snow plow
import {
    newTracker,
    enableActivityTracking,
    trackPageView,
    setUserId,
    setUserIdFromCookie
}
    from '@snowplow/browser-tracker';

import {
    LinkClickTrackingPlugin,
    enableLinkClickTracking
}
    from '@snowplow/browser-plugin-link-click-tracking';

import {
    BrowserFeaturesPlugin,
} from '@snowplow/browser-plugin-browser-features';

import { FormTrackingPlugin, enableFormTracking } from '@snowplow/browser-plugin-form-tracking';
import { EcommercePlugin } from '@snowplow/browser-plugin-ecommerce';
import { addGlobalContexts } from "@snowplow/browser-tracker";

// require('dotenv').config();

const middleware = [thunk];

if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger());
}

let store = createStore(
    reducers,
    applyMiddleware(...middleware)
)

let user_id = storeConfig.getUser() == null ? null : storeConfig.getUser().id
let user_name = storeConfig.getUser() == null ? null : storeConfig.getUser().username
let phone_number = storeConfig.getUser() == null ? null : storeConfig.getUser().phone_number
let email = storeConfig.getUser() == null ? null : storeConfig.getUser().email
let address = storeConfig.getUser() == null ? null : storeConfig.getUser().address

// context
let user_context = {
    schema: "iglu:com.bookshop/user_context/jsonschema/1-0-0",
    data: {
        user_id: user_id,
        user_name: user_name,
        phone_number: phone_number,
        email: email,
        address: address
    }
}

window.localStorage.setItem("user_context", user_context);

const COLLECTOR_HOST = process.env.REACT_APP_COLLECTOR_HOST || 'localhost'
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost'

console.log(process.env)
console.log("backend_host", BACKEND_HOST, "\t", process.env.REACT_APP_BACKEND_HOST)
console.log("collector_host", COLLECTOR_HOST, "\t", process.env.REACT_APP_COLLECTOR_HOST)

// snowplow
newTracker("book-shop-tracker", `http://${COLLECTOR_HOST}:8080`, {
    appId: "book-shop", // you can specify your own app name here
    platform: "web",
    encodeBase64: true,

    contexts: {
        webPage: true, // this sets a unique id for each page view
        performanceTiming: true, // this captures performance metrics like load times
        session: true, // Adds client session context entity to events, off by default. Available in v3.5+.
        browser: true, // Adds browser context entity to events, off by default. Available in v3.9+.
        gaCookies: true,
        geolocation: false,
    },

    plugins: [
        LinkClickTrackingPlugin(),
        BrowserFeaturesPlugin(),
        FormTrackingPlugin(),
        EcommercePlugin()
    ]

})

setUserId(getUserId());

addGlobalContexts([user_context]);

enableLinkClickTracking();
enableActivityTracking({
    minimumVisitLength: 600,
    heartbeatDelay: 10
});
trackPageView();

enableFormTracking({
    options: {
        events: ['submit_form', 'focus_form', 'change_form']
    },
});


render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root')
)
