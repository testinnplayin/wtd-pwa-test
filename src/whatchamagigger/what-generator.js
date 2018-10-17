'use strict';

const mongoose = require('mongoose');

const {Whatchamagigger} = require('../models/whatchamagigger');

let timeout;

function createWhat(newWhat) {
    console.log('---- Creating new whatchamagigger! ----');
    Whatchamagigger
        .create(newWhat)
        .then(wat => {
            // triggerLoop(newWhat);
            // return getSuccess(res, wat, str, 201);
        })
        .catch(err => console.error(`Error: creating whatchamagigger: ${err}`));
}

function triggerWhatCreation(doh) {
    console.log('triggerWhatCreation');
    const newWhat = {
        is_ok : true,
        thingamabob_msg : doh.thingamabob_bp.awesome_field,
        parent_dohicky : doh._id
    },
        str = 'whatchamagigger';

    Whatchamagigger
        .create(newWhat)
        .then(wat => {
            triggerLoop(newWhat);
        })
        .catch(err => console.error(`Error: creating whatchamagigger: ${err}`));

    timeout = triggerLoop(newWhat);
}

function triggerLoop(newWhat) {
    console.log('---- Whatchamagigger created, loop triggered ----');
    timeout = setInterval(function () {
        createWhat(newWhat);
        // triggerLoop(newWhat);
    }, 60000);
}

function stopWhatLoop() {
    console.log('---- Whatchamagigger loop stopped ----');
    clearInterval(timeout);
}

module.exports = { stopWhatLoop, triggerWhatCreation };