import { gReqOpts, resources } from '../../api-res.js';
import renderers from '../../scripts/helpers/renderers.js';

'use strict';

const endpnt = `${resources.bAddress}/api/${resources.elements.tEle}`;



// state object

let state = {};



// API calls

function fetchThingamabobs() {
    const getReq = new Request(endpnt, gReqOpts);

    fetch(getReq)
        .then(response => {
            if (!response.ok) throw new Error(response.statusText);

            return response;
        })
        .then(res => res.json())
        .then(data => {
            console.info('Successful response ', data);
            state.thingamabobs = data.thingamabobs;
            state.tMsg = `Successful retrieval of thingamabobs`;
            console.log('state from inside thingamabobs fetch ', state);
            renderList();
        })
        .catch(err => {
            console.error(`Error fetching thingamabobs: ${err}`);
            state.thingamabobs = ['Error'];
            state.tMsg = `Error fetching thingamabobs`;
        });
}



// LISTENERS

function createClickListener(eleId) {
    let btn = document.getElementById(eleId);
    btn.addEventListener('click', e => {
        console.log('CLICK ', e.currentTarget);
    });
}


// RENDER functions

function renderList() {
    const rawData = state.thingamabobs;

    rawData.forEach((thingamabob, i) => {
       let li = renderers.renderListEle(thingamabob, i, '.t-list');
       createClickListener(thingamabob._id);
    });
}

function setUpList() {
    fetchThingamabobs();
}

setUpList();