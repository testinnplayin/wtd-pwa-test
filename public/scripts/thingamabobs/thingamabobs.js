import { gReqOpts, resources } from '../../api-res.js';
import renderers from '../../scripts/helpers/renderers.js';

'use strict';

const endpnt = `${resources.bAddress}/api/${resources.elements.tEle}`;



// state object

let state = {};



// API calls

function fetchThingamabob(tId) {
    let url = `${endpnt}/${tId}`;

    const getReq = new Request(url, gReqOpts);

    fetch(getReq)
        .then(response => {
            if (!response.ok) throw new Error(response.statusText);

            return response;
        })
        .then(res => res.json())
        .then(data => {
            console.info('Successful retrieval of thingamabob');
            state.thingamabob = data.thingamabob;
            state.tMsg = `Successful retrieval of thingamabob of id ${tId}`;
            console.log('state from inside single fetch ', state);
            // TODO: render item
            renderTItemModal(data.thingamabob);
        })
        .catch(err => {
            console.error(`Error retrieving thingamabob of id ${tId}`);
            state.thingamabob = 'Error';
            state.tMsg = `Error retrieving thingamabob`;
        });
}

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

function setUpModalBtn() {
    let btn = document.querySelector('.m-close-btn');
    btn.addEventListener('click', () => {
        document.getElementById('t-modal').classList.add('hidden');
        clearModal();
    });
}

function setUpModal() {
    document.getElementById('t-modal').classList.add('hidden');
}

function createClickListener(eleId) {
    let btn = document.getElementById(eleId);
    btn.addEventListener('click', e => {
        const eId = e.currentTarget.getAttribute('id');
        if (eleId === eId) fetchThingamabob(eId);
    });
}



// RENDER functions

function clearModal() {
    let parent = document.querySelector('.t-m-body');
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function renderTItemModal(thingamabob) {
    document.getElementById('t-modal').classList.remove('hidden');
    let h2 = document.createElement('h2');
    let pDiv = document.querySelector('.t-m-body');
    pDiv.appendChild(h2);
    h2.textContent = thingamabob.awesome_field;
    h2.classList.add('t-m-title');
    h2.classList.add('m-title');
}

function renderList() {
    const rawData = state.thingamabobs;

    rawData.forEach((thingamabob, i) => {
       let li = renderers.renderListEle(thingamabob, i, '.t-list');
       createClickListener(thingamabob._id);
    });
}

function setUpList() {
    fetchThingamabobs();
    setUpModal();
    setUpModalBtn();
}

setUpList();