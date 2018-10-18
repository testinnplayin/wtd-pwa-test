'use strict';

export const resources = {
    bAddress : 'http://192.168.1.46:3000',
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