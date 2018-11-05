const firebase = require('firebase-admin');
const { google } = require('googleapis');
'use strict';

const mongoose = require('mongoose');

const { User } = require('../models/user');
const { Whatchamagigger } = require('../models/whatchamagigger');
const key = require('../../thingamabobs-95715-firebase-adminsdk-69w92-99e8cdb405.json');
const { CLIENT_SECRET, OUTSIDE_ADDRESS, port } = require('../../config');

firebase.initializeApp({
    credential : firebase.credential.cert(key),
    databaseURL : "https://thingamabobs-95715.firebaseio.com"
});

let timeout;

function createWhat(newWhat, socket) {
    console.log('---- Creating new whatchamagigger! ----');
    console.log('newWhat ', newWhat);
    console.log((socket) ? 'true' : 'false');
    Whatchamagigger
        .create(newWhat)
        .then(wat => {
            console.log('---- Whatchamagigger created ----');
            // socket.emit('WHAT_CREATED', wat);
        })
        .catch(err => console.error(`Error: creating whatchamagigger: ${err}`));
}

function generateGoogleToken () {
    return new Promise((resolve, reject) => {
        const oauthStuff = new google.auth.OAuth2(
            key.client_email,
            CLIENT_SECRET,
            `https://${OUTSIDE_ADDRESS}:${port}/` // start back up from here
        );

        oauthStuff.autorize((err, tokens) => {
            if (err) {
                console.error('Problem with JWT authorization: ' + err);
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}

function triggerWhatCreation(doh) {
    const newWhat = {
        is_ok : true,
        thingamabob_msg : doh.thingamabob_bp.awesome_field,
        parent_dohicky : doh._id
    };

    Whatchamagigger
        .create(newWhat)
        .then(wat => {
            console.log('---- Whatchamagigger created, loop triggered ----');
            User
                .find()
                .exec()
                .then(users => {
                    if (!users) {
                        console.error('Error: cannot find users ', err);
                    }
                    users.forEach(user => {
                        let reqBody = {
                            notification : {
                                body : wat.thingamabob_msg,
                                title : 'New whatchamagigger!'
                            },
                            android : {
                                ttl : 60000,
                                priority : 'high',
                                notification : {
                                    body : wat.thingamabob_msg,
                                    title : 'New whatchamagigger!'
                                }
                            },
                            webpush : {
                                notification : {
                                    title : 'New whatchamagigger!',
                                    body : wat.thingamabob_msg
                                }
                            },
                            token : user.token
                        };

                        firebase.messaging().send(reqBody)
                            .then(res => console.log('successful message sent ', res))
                            .catch(err => console.error(`Error sending message: ${err}`));
                    });
                })
                .catch(err => console.error('Error: cannot fetch users: ', err));
            // triggerLoop(newWhat);
        })
        .catch(err => console.error(`Error: creating whatchamagigger: ${err}`));
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