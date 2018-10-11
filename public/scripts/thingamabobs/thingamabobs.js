import { gReqOpts, resources } from '../../api-res.js';
import renderers from '../../scripts/helpers/renderers.js';

'use strict';

const endpnt = `${resources.bAddress}/api/${resources.elements.tEle}`;

let state = {};

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

function renderList() {
    const rawData = state.thingamabobs;

    rawData.forEach((thingamabob, i) => {
       let li = renderers.renderListEle(thingamabob, i, '.t-list');
       console.log('li ', li);
    });
}

function setUpList() {
    console.log('setUpList triggered');
    fetchThingamabobs();
}

setUpList();