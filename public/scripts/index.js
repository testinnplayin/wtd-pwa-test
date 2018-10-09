import {
    gReqOpts,
    resources
} from './dashboard-api-res.js';
import {
    thingamabobTableTitles,
    thingamabobTableFields
} from './table-data.js';

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
        .catch(err => {
            console.error(`Error retrieving dohicky count: ${err}`);
            state.dCount = 'Error';
            state.dCMsg = `Error retrieving dohicky count`;
        });
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
            console.error(`Error retrieving thingamabob count: ${err}`);
            state.tCount = 'Error';
            state.tCMsg = `Error retrieving thingamabob count`;
        });
}

function fetchTTable(tableId) {
    const endpnt = `${resources.bAddress}/${resources.api}/${tableId}/${resources.t}`,
        getReq = new Request(endpnt, gReqOpts);
    
    fetch(getReq)
        .then(response => {
            if (!response.ok) throw new Error(response.statusText);

            return response;
        })
        .then(res => res.json())
        .then(data => {
            state.rawTData = data.dohickies;
            state.tDataMsg = `Successful retrieval of table data for ${tableId}`;
            console.log('state inside fetchTTable ', state);
            let modal = document.getElementById('table-modal');
            modal.classList.remove('hidden');
            renderTable(tableId, data.dohickies);
        })
        .catch(err => {
            console.error(`Error retrieving table data for ${tableId}: ${err}`);
            state.rawTData = 'Error';
            state.tDataMsg = `Error retrieving table data for ${tableId}`;
        });
}



// LISTENERS

function setUpWButton (ele) { // widget button set up, opens modal
    ele.addEventListener('click', (e) => {
        console.log('CLICK ', e.currentTarget);
        const tableId = e.currentTarget.getAttribute('id');
        fetchTTable(tableId);
    });
}

function setUpMButton () { // modal close button, clears table
    document.querySelector('.modal-close-btn').addEventListener('click', () => {
        document.getElementById('table-modal').classList.add('hidden');
        let pHead = document.querySelector('.m-body-th-tr');
        while (pHead.firstChild) {
            pHead.removeChild(pHead.firstChild);
        }
        let pBody = document.querySelector('.m-body-t-body');
        while (pBody.firstChild) {
            pBody.removeChild(pBody.firstChild);
        }
    });
}

function setUpModal () {
    let modal = document.getElementById('table-modal');
    modal.classList.add('hidden');
}



// RENDER FUNCTIONS

function renderWidget(hook, data) {
    let p = document.createElement('p');
    document.querySelector(hook).appendChild(p);
    p.textContent = data;
}

function renderTHead(arr) {
    arr.forEach(item => {
        let ele = document.createElement('td');
        document.querySelector('.m-body-th-tr').appendChild(ele);
        ele.textContent = item;
    });
}

function renderTable(tableId, data) {
    if (tableId === 'thingamabobs') {
        renderTHead(thingamabobTableTitles);
        data.forEach((doh, i) => {
            let tr = document.createElement('tr');
            document.querySelector('.m-body-t-body').appendChild(tr);
            tr.classList.add(`t-body-tr-${i}`);
            thingamabobTableFields.forEach((field, j) => {
                let td = document.createElement('td');
                tr.appendChild(td);
                td.classList.add(`t-body-td-${j}`);
                if (field.includes('Linked dohicky')) {
                    td.textContent = field + doh._id;
                } else {
                    td.textContent = doh.thingamabob_id.awesome_field;
                }
            });
        });
    }
}



// equivalent to created function in Vue.js... sets up the initial state
function setUpState () {
    fetchTCount();
    fetchDCount();
    setUpWButton(tClick);
    setUpWButton(dClick);
    setUpModal();
    setUpMButton();
}

setUpState();