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
    t : 'table'
};

export const gReqOpts = { method : 'GET', mode : 'cors' };
export let uReqOpts = {
    method : 'PUT',
    mode : 'cors',
    headers : {
        'Content-Type' : 'application/json'
    }
};