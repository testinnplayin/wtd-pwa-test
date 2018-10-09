import {
    gReqOpts,
    resources
} from './dashboard-api-res.js';

'use strict';

const dClick = document.querySelector('.d-widget'),
    tClick = document.querySelector('.t-widget');


    
// state object

let state = {};



// API FUNCTIONS

function fetchDCount() {
    const endpnt = `${resources.bAddress}/${resources.api}/${resources.elements.dEle}/${resources.c}`,
        getReq = new Request(endpnt, gReqOpts);
    
    fetch(getReq)
        .then(response => {
            console.log('response ', response);
            if (!response.ok) throw new Error(response.statusText);

            return response;
        })
        .then(res => res.json())
        .then(data => {
            state.dCount = data.count;
            state.dCMsg = `Successful retrieval of dohicky count`;

            console.log('state ', state);
            renderWidget('.d-widget', data.count);
        })
}

function fetchTCount() {
    const endpnt = `${resources.bAddress}/${resources.api}/${resources.elements.tEle}/${resources.c}`,
        getReq = new Request(endpnt, gReqOpts);

    fetch(getReq)
        .then(response => {
            console.log('response ', response);
            if (!response.ok) throw new Error(response.statusText);

            return response;
        })
        .then(res => res.json())
        .then(data => {
            state.tCount = data.count;
            state.tCMsg = `Successful retrieval of thingamabob count`;

            console.log('state ', state);
            renderWidget('.t-widget', data.count);
        })
        .catch(err => {
            console.error(`Error fetching thingamabob count: ${err}`);
            state.tCount = 'N/A';
            state.tCMsg = `Error retrieving thingamabob count: ${err}`;
        });
}



// LISTENERS

function setUpButton (ele) {
    ele.addEventListener('click', () => {
        console.log('CLICK');
    });
}



// RENDER FUNCTIONS

function renderWidget(hook, data) {
    let p = document.createElement('p');
    document.querySelector(hook).appendChild(p);
    p.textContent = data;
}

// equivalent to created function in Vue.js... sets up the initial state
function setUpState () {
    fetchTCount();
    fetchDCount();
    setUpButton(tClick);
}

setUpState();