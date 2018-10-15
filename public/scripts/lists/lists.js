import { gReqOpts, resources } from '../../api-res.js';
import {viewTitles} from '../constants/lists.js';
import renderers from '../helpers/renderers.js';

'use strict';

const browserLoc = window.location.href;
let endpnt = `${resources.bAddress}/api/`;

if (browserLoc.includes('thingamabobs')) {
    endpnt += resources.elements.tEle;
} else if (browserLoc.includes('dohickies')){
    endpnt += resources.elements.dEle;
}

console.log('endpnt ', endpnt);



// state object

let state = {};



// API calls

function fetchThingamabob(str, tId) {
    let url = `${endpnt}/${tId}`;

    const getReq = new Request(url, gReqOpts);

    fetch(getReq)
        .then(response => {
            if (!response.ok) throw new Error(response.statusText);

            return response;
        })
        .then(res => res.json())
        .then(data => {
            console.info('Successful retrieval of ' + str);
            state[str] = data[str];
            state.tMsg = `Successful retrieval of ${str} of id ${tId}`;
            console.log('state from inside single fetch ', state);
            // TODO: render item
            renderTItemModal(data[str]);
        })
        .catch(err => {
            console.error(`Error retrieving ${str} of id ${tId}`);
            state[str] = 'Error';
            state.tMsg = `Error retrieving ${str}`;
        });
}

function fetchThingamabobs(str) {
    const getReq = new Request(endpnt, gReqOpts);

    fetch(getReq)
        .then(response => {
            if (!response.ok) throw new Error(response.statusText);

            return response;
        })
        .then(res => res.json())
        .then(data => {
            console.info('Successful response ', data);
            state[str] = data[str];
            state.tMsg = `Successful retrieval of ${str}`;
            console.log('state from inside ' + str + ' fetch ', state);
            renderList(str);
        })
        .catch(err => {
            console.error(`Error fetching ${str}: ${err}`);
            state[str] = ['Error'];
            state.tMsg = `Error fetching ${str}`;
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

function setUpModals() {
    document.getElementById('t-modal').classList.add('hidden');
    document.getElementById('f-modal').classList.add('hidden');
}

function createClickListener(eleId) {
    let btn = document.getElementById(eleId);
    btn.addEventListener('click', e => {
        const eId = e.currentTarget.getAttribute('id');
        if (eleId === eId) {
            if (browserLoc.includes('dohickies')) {
                fetchThingamabob('dohicky', eId);
            } else if (browserLoc.includes('thingamabobs')) {
                fetchThingamabob('thingamabob', eId);
            }
        }
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

function renderList(str) {
    const rawData = state[str];

    if (browserLoc.includes('dohickies')) {
        rawData.forEach((dohicky, i) => {
            let li = renderers.renderListEle(dohicky, i, '.t-list');
            let btn = document.getElementById(dohicky._id);
            if (dohicky.thingamabob_id) {
                btn.textContent = dohicky.thingamabob_id.awesome_field;
            } else {
                btn.textContent = dohicky.thingamabob_bp.awesome_field;
            }
            createClickListener(dohicky._id);
        });
    } else if (browserLoc.includes('thingamabobs')) {
        rawData.forEach((thingamabob, i) => {
            let li = renderers.renderListEle(thingamabob, i, '.t-list');
            let btn = document.getElementById(thingamabob._id);
            btn.textContent = thingamabob.awesome_field;
            createClickListener(thingamabob._id);
         });
    }
}

// SET UP functions

function setUpH1() {
    let titleP = document.querySelector('.view-title');
    if (browserLoc.includes('dohickies')) {
        // NOTE: this is assuming that the dohickies title is first in the array
        titleP.textContent = viewTitles[0];
    } else if (browserLoc.includes('thingamabobs')) {
        // NOTE: this is assuming that the thingamabobs title is second in the array
        titleP.textContent = viewTitles[1];
    }
}

function setUpH3() {
    const tBtnSexn = document.querySelector('.t-button-sexn');
    if (browserLoc.includes('thingamabobs')) {
        tBtnSexn.classList.remove('hidden');
    }
}

function setUpInitFetch() {
    if (browserLoc.includes('thingamabobs')) {
        fetchThingamabobs('thingamabobs');
    } else if (browserLoc.includes('dohickies')) {
        fetchThingamabobs('dohickies');
    }
}

function setUpList() {
    setUpH1();
    setUpH3();
    setUpInitFetch();

    setUpModals();
    setUpModalBtn();
}

setUpList();