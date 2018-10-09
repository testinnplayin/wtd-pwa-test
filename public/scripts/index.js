import {resources} from './dashboard-api-res.js';

'use strict';

const dClick = document.querySelector('.d-widget'),
    tClick = document.querySelector('.t-widget');

let state = {};


function fetchTCount() {
    console.log('resources ', resources);
    const endpnt = `${resources.bAddress}/${resources.api}/${resources.elements.tEle}/${resources.c}`,
        reqOpts = { method : 'GET', mode : 'cors' },
        getReq = new Request(endpnt, reqOpts);

    fetch(getReq)
        .then(response => {
            console.log('response ', response);
            if (!response.ok) throw new Error(response.statusText);

            return response;
        })
        .then(res => res.json())
        .then(data => {
            console.log('Success! ', data);
            state.tCount = data.count;
            state.tCMsg = `Successful retrieval of thingamabob count`;
            console.log('state ', state);
        })
        .catch(err => {
            console.error(`Error fetching thingamabob count: ${err}`);
            state.tCount = 'N/A';
            state.tCMsg = `Error retrieving thingamabob count: ${err}`;
        });
}


function setUpState () {
    console.log('setUpState')
    fetchTCount();
}

setUpState();

function setUpButton (ele) {
    ele.addEventListener('click', () => {
        console.log('CLICK');
    });
}


setUpButton(tClick);

console.log('state ', state);