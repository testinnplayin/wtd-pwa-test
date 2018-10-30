'use strict';

import backendInfo from './back-end-conf.js';

export const resources = {
    bAddress : `https://${backendInfo.tcpIp}:${backendInfo.port}`,
    api : 'api/dashboard',
    elements : {
        dEle : 'dohickies',
        tEle : 'thingamabobs',
        wEle : 'whatchamagiggers'
    },
    c : 'count',
    t : 'table',
    u : 'users'
};

export const gReqOpts = { method : 'GET', mode : 'cors' };
export const pReqOpts = {
    method : 'POST',
    mode : 'cors',
    headers : {
        'Content-Type' : 'application/json'
    }
};
export let uReqOpts = {
    method : 'PUT',
    mode : 'cors',
    headers : {
        'Content-Type' : 'application/json'
    }
};