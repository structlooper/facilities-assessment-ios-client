import Logger from "../Logger";
import _ from 'lodash';

const fetchWithTimeOut = (url, options, timeout = 20000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Server request timed out")), timeout)
        )
    ]);
};

const fetchFactory = (endpoint, method = "GET", params, responseModifier, cb, errorHandler) =>
    fetchWithTimeOut(endpoint, {"method": method, ...params})
        .then(responseModifier)
        .then((responseModifier) => {
            if (!_.isNil(responseModifier.error) || (!_.isNil(responseModifier.httpStatusCode) && responseModifier.httpStatusCode > 400))
                errorHandler(responseModifier);
            else
                cb(responseModifier);
        })
        .catch((error) => {
            console.log("requests", "fetchFactory, errorHandler");
            errorHandler(error);
        });

const makeHeader = (type) => new Map(
    [['json', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'credentials': "same-origin"
    }],
        ['text', {
            headers: {'Accept': 'text/plain', 'Content-Type': 'text/plain'}
        }]]).get(type);

let _get = (endpoint, cb, errorHandler) => {
    Logger.logDebug('requests', `GETing from ${endpoint}`);
    return fetchFactory(endpoint, "GET", makeHeader("json"), (response) => response.json(), cb, errorHandler);
};

let _getText = (endpoint, cb, errorHandler) =>
    fetchFactory(endpoint, "GET", makeHeader("json"), (response) => response.text(), cb, errorHandler);

export let post = (endpoint, body, cb, errorHandler) => {
    Logger.logDebug('requests', `POSTing to ${endpoint}`);
    return fetchFactory(endpoint, "POST", {body: JSON.stringify(body), ...makeHeader("json")}, (response) => {
        return response.json();
    }, cb, errorHandler);
};

export let get = (endpoint, cb, errorHandler) => {
    return new Map([[true, _get], [false, _getText]]).get(endpoint.endsWith(".json"))(endpoint, cb, errorHandler);
};

export let getJSON = (endpoint, cb, errorHandler) => {
    if (errorHandler === undefined) {
        errorHandler = (arg) => {
        };
    }
    return _get(endpoint, cb, errorHandler);
};
