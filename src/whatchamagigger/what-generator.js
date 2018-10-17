'use strict';

const mongoose = require('mongoose');

const {Whatchamagigger} = require('../models/whatchamagigger');

let timeout;

function createWhat(newWhat) {
    console.log('---- Creating new whatchamagigger! ----');
    Whatchamagigger
        .create(newWhat)
        .then(() => {
        console.log('---- Whatchamagigger created ----');
        })
        .catch(err => console.error(`Error: creating whatchamagigger: ${err}`));
}

function triggerWhatCreation(doh) {
    const newWhat = {
        is_ok : true,
        thingamabob_msg : doh.thingamabob_bp.awesome_field,
        parent_dohicky : doh._id
    };

    Whatchamagigger
        .create(newWhat)
        .then(() => {
            console.log('---- Whatchamagigger created, loop triggered ----');
            triggerLoop(newWhat);
        })
        .catch(err => console.error(`Error: creating whatchamagigger: ${err}`));

    timeout = triggerLoop(newWhat);
}

function triggerLoop(newWhat) {
    timeout = setInterval(function () {
        createWhat(newWhat);
    }, 60000);
}

function stopWhatLoop() {
    console.log('---- Whatchamagigger creation loop stopped ----');
    clearInterval(timeout);
}

module.exports = { stopWhatLoop, triggerWhatCreation };