import { gReqOpts, resources, uReqOpts } from '../../api-res.js';
import {viewTitles} from '../constants/lists.js';
import renderers from '../helpers/renderers.js';
import listeners from '../helpers/events.js';

const socket = io('http://192.168.1.46:3000');

'use strict';

const browserLoc = window.location.href;
let endpnt = `${resources.bAddress}/api/`;

if (browserLoc.includes('thingamabobs')) {
    endpnt += resources.elements.tEle;
} else if (browserLoc.includes('dohickies')){
    endpnt += resources.elements.dEle;
}

// state object

let state = {};



// API calls

function fetchResource(str, tId) {
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
            renderTItemModal(data[str], str);
        })
        .catch(err => {
            console.error(`Error retrieving ${str} of id ${tId}`);
            state[str] = 'Error';
            state.tMsg = `Error retrieving ${str}`;
        });
}

function fetchResources(str) {
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

function activateDohicky() {
    const uDoh = state.dohicky;
    socket.emit('ACTIVATE_DOHICKY', uDoh);
}



// LISTENERS

function addPBtnListener(pBtn) {
    pBtn.addEventListener('click', e => {
        // NOTE: state.dohicky should be the same dohicky that was called to populate the modal
        console.log('play button click!', e.currentTarget, state);
        const eId = e.currentTarget.getAttribute('id');
        if (eId === state.dohicky._id) {
            if (!state.dohicky.is_active) state.dohicky.is_active = !state.dohicky.is_active;
            // Need to update the back-end here
            console.log('updated state ', state);
            activateDohicky();
        }
    });
}

function setUpModalBtn(btn, mId) {
    btn.addEventListener('click', () => {
        document.getElementById(mId).classList.add('hidden');
        
        clearModal();

        const pBtn = document.querySelector('.play-btn-div');
        if (pBtn) {
            clearPlayBtn(pBtn);
        }
    });
}

function createClickListener(eleId) {
    let btn = document.getElementById(eleId);
    btn.addEventListener('click', e => {
        const eId = e.currentTarget.getAttribute('id');
        if (eleId === eId) {
            if (browserLoc.includes('dohickies')) {
                fetchResource('dohicky', eId);
            } else if (browserLoc.includes('thingamabobs')) {
                fetchResource('thingamabob', eId);
            }
        }
    });
}

function activateDohSucc() {
    socket.on('ACTIVATE_DOH_SUCCESS', response => {
        console.log('Dohicky activated! ', response);
        const p = document.createElement('p');
        document.querySelector('.play-btn-div').appendChild(p);
        p.textContent = `Dohicky ${response._id} is now active!`;
    });
}

function activateDohError() {
    socket.on('ACTIVATE_DOH_ERROR', err => {
        console.error('Error activating dohicky! ', err);
    });
}

// function listenForWhat() {
//     socket.on('WHAT_CREATED', response => {
//         console.log('What created! ', response);
//         console.log(Notification.permission)
//         if ('serviceWorker' in navigator && Notification.permission === 'granted') {
//             navigator.serviceWorker.getRegistration()
//                 .then(registration => {
//                     console.log('got registered sw ', registration);
//                     const options = {
//                         body : `New whatchamagigger created for thingamabob ${response.thingamabob_msg}`
//                     };
//                     registration.showNotification('New Whatchamagigger', options);
//                 })
//                 .catch(err => console.error(`Error: ${err}`));
//         }
//     });
// }



// RENDER functions

function clearModal() {
    let parent = document.querySelector('.t-m-body');
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function clearPlayBtn(pBtn) {
    pBtn.parentNode.removeChild(pBtn);
}

function renderPlayBtn(resource) {
    const div = document.createElement('div');
    document.querySelector('.inner-m-div').appendChild(div);
    div.classList.add('play-btn-div');

    const pBtn = document.createElement('button');
    div.appendChild(pBtn);
    pBtn.classList.add('play-btn');
    pBtn.setAttribute('id', resource._id);
    pBtn.textContent = 'Play';

    addPBtnListener(pBtn);
}

function renderTItemModal(resource, str) {
    document.getElementById('t-modal').classList.remove('hidden');
    let h2 = document.createElement('h2');
    let pDiv = document.querySelector('.t-m-body');
    pDiv.appendChild(h2);

    if (str === 'thingamabob') {
        h2.textContent = resource.awesome_field;
    } else {
        if (resource.thingamabob_id) {
            h2.textContent = `Dohicky of thingamabob ${resource.thingamabob_id.awesome_field}`;
            renderPlayBtn(resource);
        } else {
            h2.textContent = `Dohicky of deleted thingamabob ${resource.thingamabob_bp.awesome_field}`;
        }
    }

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

function setUpAddBtn() {
    const addBtn = document.querySelector('.t-add'),
        fModal = document.getElementById('f-modal');

    addBtn.addEventListener('click', () => {
        fModal.classList.remove('hidden');
    });
}

function setUpInitFetch() {
    if (browserLoc.includes('thingamabobs')) {
        fetchResources('thingamabobs');
    } else if (browserLoc.includes('dohickies')) {
        fetchResources('dohickies');
    }
}

function setUpList() {
    activateDohSucc();
    activateDohError();
    listeners.listenForWhat(socket);
    setUpH1();
    // Thingamabob-specific set up
    setUpH3();
    setUpAddBtn();

    setUpInitFetch();

    setUpModalBtn(document.querySelector('.t-close-btn'), 't-modal');
    setUpModalBtn(document.querySelector('.f-close-btn'), 'f-modal');
}

setUpList();