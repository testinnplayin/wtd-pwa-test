import {
    gReqOpts,
    resources
} from './dashboard-api-res.js';
import {
    dohickyTableFields,
    dohickyTableTitles,
    thingamabobTableTitles,
    thingamabobTableFields
} from './table-data.js';
import renderers from './helpers/renderers.js';

'use strict';

// urls

const dCountUrl = `${resources.bAddress}/${resources.api}/${resources.elements.dEle}/${resources.c}`,
    tCountUrl = `${resources.bAddress}/${resources.api}/${resources.elements.tEle}/${resources.c}`;

// element selectors
const dClick = document.querySelector('.d-widget'),
    tClick = document.querySelector('.t-widget');



// state object

let state = {};



// API FUNCTIONS

function fetchDCount() {
    const getReq = new Request(dCountUrl, gReqOpts);
    
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
    const getReq = new Request(tCountUrl, gReqOpts);

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

function checkCacheForTData(tableId, url) {
    if ('caches' in window) {
        caches.match(url)
            .then(res => {
                if (res) {
                    res.json()
                        .then(data => {
                            console.log('retrieval from cache successful');
                            state.rawTData = data.dohickies;
                            state.tDataMsg = `Successful retrieval from cache for table data for ${tableId}`;
                            console.log('state inside cache area ', state.rawTData);
                            let modal = document.getElementById('table-modal');
                            modal.classList.remove('hidden');
                            renderTable(tableId, data.dohickies);
                            hasCache = true;
                            return hasCache;
                        })
                } else {
                    throw new Error(`${url} not in cache`);
                }
            })
            .catch(err => {
                console.error(`Error retrieving table data for ${tableId} from cache: ${err}`);
                state.rawTData = 'Error';
                state.tDataMsg = 'Error retrieving table data from cache';
            });
        return true;
    }
}

function fetchTableData(tableId) {
    const endpnt = `${resources.bAddress}/${resources.api}/${tableId}/${resources.t}`,
        getReq = new Request(endpnt, gReqOpts);
    
    let hasCache = false;
    hasCache = checkCacheForTData(tableId, endpnt);

    fetch(getReq)
        .then(response => {
            if (!response.ok) throw new Error(response.statusText);

            return response;
        })
        .then(res => res.json())
        .then(data => {
            state.rawTData = data.dohickies;
            state.tDataMsg = `Successful retrieval of table data for ${tableId}`;
            let modal = document.getElementById('table-modal');
            modal.classList.remove('hidden');

            if (hasCache) {
                updateTable(tableId);
            } else {
                renderTable(tableId, data.dohickies);
            }
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
        const tableId = e.currentTarget.getAttribute('id');
        fetchTableData(tableId);
    });
}

function setUpMButton () { // modal close button, clears table
    document.querySelector('.modal-close-btn').addEventListener('click', () => {
        document.getElementById('table-modal').classList.add('hidden');
        let pHead = document.querySelector('.m-body-th-tr'),
            pBody = document.querySelector('.m-body-t-body');

        // remove head and body children elements so clears table
        while (pHead.firstChild) {
            pHead.removeChild(pHead.firstChild);
        }
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

// Widget-related render

function renderWidget(hook, data) {
    let p = document.createElement('p');
    document.querySelector(hook).appendChild(p);
    p.textContent = data;
}

// Modal-related renders

function renderTHead(arr) {
    arr.forEach(item => {
        let ele = document.createElement('th');
        document.querySelector('.m-body-th-tr').appendChild(ele);
        ele.textContent = item;
    });
}

function renderDohTable(data) {
    renderTHead(dohickyTableTitles);
    data.forEach((doh, i) => {
        let trKlass = 't-body-tr',
            tr = renderers.renderEle(i, 'tr', 't-body-tr', '.m-body-t-body');
        dohickyTableFields.forEach((field, j) => {
            let td = renderers.renderEle(i, 'td', `t-body-td-${j}`, `.${trKlass}-${i}`);

            if (field === 'field') {
                if (!doh.thingamabob_id) {
                    td.textContent = doh.thingamabob_bp.awesome_field;
                } else {
                    td.textContent = doh.thingamabob_id.awesome_field;
                }
            } else if (field === 'is_ok') {
                renderIsOk(doh, td);
            } else {
                if (!doh.thingamabob_id) {
                    td.textContent = `Linked to deleted thingamabob ${doh.thingamabob_bp._id}`;
                } else {
                    td.textContent = `Linked to thingamabob ${doh.thingamabob_id._id}`;
                }
            }
        });
    });
}

function renderIsOk(doh, td) {
    if (!doh.is_ok) {
        td.textContent = 'Not valid';
        td.classList.add('warning');
    } else {
        td.textContent = 'Valid';
    }
}

function renderThingTable(data) {
    renderTHead(thingamabobTableTitles);
    data.forEach((doh, i) => {
        let tr = renderers.renderEle(i, 'tr', 't-body-tr', '.m-body-t-body'),
            trKlass = 't-body-tr';
        thingamabobTableFields.forEach((field, j) => {
            let td = renderers.renderEle(i, 'td', `t-body-td-${j}`, `.${trKlass}-${i}`);

            if (field.includes('Linked dohicky')) {
                td.textContent = field + doh._id;
            } else {
                td.textContent = doh.thingamabob_id.awesome_field;
            }
        });
    });
}

function renderTable(tableId, data) {
    if (tableId === 'thingamabobs') {
        renderThingTable(data);
    } else if (tableId === 'dohickies') {
        renderDohTable(data);
    }
}

// Update render functions

function updateTable(tableId) {
    const rawTData = state.rawTData;

    if (tableId === 'thingamabobs') {
        rawTData.forEach((doh, i) => {
            thingamabobTableFields.forEach((field, j) => {
                let td = document.querySelector(`.t-body-td-${j}-${i}`),
                    currVal = doh.thingamabob_id.awesome_field;

                if (field === 'field') {
                    if (td.innerHTML !== currVal) td.textContent = currVal;
                }
            });
        });
    } else {
        rawTData.forEach((doh, i) => {
            dohickyTableFields.forEach((field, j) => {
                let td = document.querySelector(`.t-body-td-${j}-${i}`),
                    oldVal = doh.thingamabob_bp.awesome_field;

                if (field === 'field') {
                    if (!doh.thingamabob_id) {
                        if (oldVal !== td.innerHTML) td.textContent = oldVal;
                    } else {
                        let newVal = doh.thingamabob_id.awesome_field;
                        if (newVal !== td.innerHTML) td.textContent = newVal;
                    }
                } else if (field === 'is_ok') {
                    if (td.innerHTML !== doh.is_ok) {
                        renderIsOk(doh, td);
                    }
                }
            });
        });
    }
}



// Set up functions

// equivalent to created function in Vue.js... sets up the initial state
function setUpStateNoSW () {
    fetchTCount();
    fetchDCount();
    setUpBtsNMod();
}

function setUpCountNBtns(url) {
    if (url.includes('dohickies')) {
        fetchDCount();
    } else {
        fetchTCount();
    }
}

function setUpBtsNMod() {
    setUpWButton(tClick);
    setUpWButton(dClick);
    setUpModal();
    setUpMButton();
}

// Service worker code, to refactor

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./sw.js')
        .then(function() {
            console.log('[Service Worker] registered');
            if ('caches' in window) {
                const countURLs = [
                    dCountUrl,
                    tCountUrl
                ];

                countURLs.forEach(cUrl => {
                    caches.match(cUrl)
                        .then(res => {
                            if (res) {
                                res.json()
                                    .then(data => {
                                        console.log('data ', data);
                                        if (data.type === 'dohickies') {
                                            state.dCount = data.count;
                                            state.dCMsg = `Successful retrieval of dohicky count from cache`;
                                        } else {
                                            state.tCount = data.count;
                                            state.tCMsg = `Successful retrieval of thingamabob count from cache`;
                                        }
                                        setUpCountNBtns(cUrl);
                                    });
                            } else {
                                throw new Error(`No count data in cache`);
                            }
                        })
                        .catch(err => {
                            console.warn('Warning: ', err)
                            setUpCountNBtns(cUrl);
                        });
                })
                setUpBtsNMod();
            }
        })
        .catch(err => console.error(`[Service Worker] registration error: ${err}`));
} else {
    setUpStateNoSW();
}