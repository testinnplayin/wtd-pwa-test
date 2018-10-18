'use strict';

const mongoose = require('mongoose');

const {Whatchamagigger} = require('../models/whatchamagigger');

let timeout;

function createWhat(newWhat, socket) {
    console.log('---- Creating new whatchamagigger! ----');
    console.log('newWhat ', newWhat);
    console.log((socket) ? 'true' : 'false');
    Whatchamagigger
        .create(newWhat)
        .then(wat => {
            console.log('---- Whatchamagigger created ----');
            socket.emit('WHAT_CREATED', wat);
        })
        .catch(err => console.error(`Error: creating whatchamagigger: ${err}`));
}

function triggerWhatCreation(doh, socket) {
    const newWhat = {
        is_ok : true,
        thingamabob_msg : doh.thingamabob_bp.awesome_field,
        parent_dohicky : doh._id
    };

    Whatchamagigger
        .create(newWhat)
        .then(wat => {
            console.log('---- Whatchamagigger created, loop triggered ----');
            socket.emit('WHAT_CREATED', wat);
            triggerLoop(newWhat, socket);
        })
        .catch(err => console.error(`Error: creating whatchamagigger: ${err}`));

    // timeout = triggerLoop(newWhat);
}

function triggerLoop(newWhat, socket) {
    console.log('triggerLoop');
    timeout = setInterval(function () {
        createWhat(newWhat, socket);
    }, 60000);
}

function stopWhatLoop() {
    console.log('---- Whatchamagigger creation loop stopped ----');
    clearInterval(timeout);
}

module.exports = { stopWhatLoop, triggerWhatCreation };