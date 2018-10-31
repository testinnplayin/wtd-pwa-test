import {
    dReqOpts,
    pReqOpts,
    resources
} from '../../api-res.js';

import bConfig from '../../back-end-conf.js';

'use strict';

const endpnt = `${resources.bAddress}/api/${resources.u}`;
firebase.initializeApp(bConfig.firebase.config);

const messaging = firebase.messaging();
messaging.usePublicVapidKey(bConfig.firebase.FCM_PUBLIC_KEY);


function sendTokenToServer(cToken, user) {
    let uEndpnt = `${endpnt}/token`,
        reqOpts = { method : 'PUT', mode : 'cors', headers : { 'Content-Type' : 'application/json' } };
    user.token = cToken;
    reqOpts.body = JSON.stringify(user);
    const uReq = new Request(uEndpnt, reqOpts);

    fetch(uReq)
        .then(response => {
            console.log('response ', response);
        })
        .catch(err => console.error(err));
}

function dealWToken(user) {
    messaging.getToken()
        .then(currentToken => {
            if (currentToken) {
                console.log('retrieve old token ', currentToken);
                sendTokenToServer(currentToken, user);
                changeRenderingOfSubStatus(true);
            } else {
                console.log('Generate new token');
                changeRenderingOfSubStatus(true);
                setTokenSentToServer(false);
            }
        })
        .catch(err => {
            console.error('Error while retrieving token: ', err);
            setTokenSentToServer(false);
        });
}

messaging.onTokenRefresh(() => {
    messaging.getToken().then(refreshedToken => {
        console.log('Token refreshed');
        setTokenSentToServer(false);
        sendTokenToServer(refreshedToken);
    })
    .catch(err => {
        console.error('Error retrieving fresh token ', err);
    });
});

function createUser(userObj) {
    let postObj = pReqOpts;
    postObj.body = JSON.stringify(userObj);
    const postReq = new Request(endpnt, postObj);

    fetch(postReq)
        .then(response => {
            console.log('response ', response);
            if (!response.ok) throw new Error(response.statusText);
            // this is a mock user look up since we don't actually have a user log in system in place
            localStorage.setItem('userId', userObj.user_id);
            console.log(localStorage);
            return response;
        })
        .then(res => res.json())
        .then(data => dealWToken(data.user))
        .catch(err => {
            console.error(`Oops : ${err}`);
        })
}

function deleteUser(userId) {
    let delEpnt = endpnt + '/' + userId,
        delReq = new Request(delEpnt, dReqOpts);

    fetch(delReq)
        .then(response => {
            if (!response.ok) throw new Error(response.statusText);
            return response;
        })
        .then(res => {
            console.info(`Deletion of user ${userId} successful`);
            changeRenderingOfSubStatus(false);
        })
        .catch(err => console.error(`Error deleting user ${userId}: ${err}`));
}

function subscribeUser() {
    console.log('subscribeUser');
    navigator.serviceWorker.ready
        .then(registration => {
            if (!registration.pushManager) {
                console.warn('Browser does not support push notifications');
                return false;
            }

            messaging.requestPermission()
                .then(() => {
                    registration.pushManager.subscribe({
                        userVisibleOnly : true // makes sure user always sees push notifications that arrive
                    })
                        .then(subscription => {
                            alert('Subscribed successfully');
                            console.info('Push notification subscribed');
                            console.log('subscription ', subscription);
                            let userIdArr = subscription.endpoint.split('/');
                            const userId = userIdArr[userIdArr.length - 1];
                            
                            createUser({ user_id : userId });
                        })
                        .catch(err2 => {
                            console.error(`Error subscribing user: ${err2}`);
                        });
                })
                .catch(err => {
                    console.error('Oops! ', err);
                })
        })
        .catch(err => {
            console.error(`Service worker is not ready: ${err}`);
        });
}

function unsubscribeUser() {
    console.log('unsubscribeUser');
    navigator.serviceWorker.ready
        .then(registration => {
            registration.pushManager.getSubscription()
                .then(subscription => {
                    if (!subscription) throw new Error('cannot find subscription');
                    
                    subscription.unsubscribe()
                        .then(() => {
                            alert('Successfully unsubscribed');
                            console.info('Successfully unsubscribed from push notifications');
                            console.log('subscription post drop ', subscription);
                            const userId = localStorage.getItem('userId');
                            deleteUser(userId);
                        })
                        .catch(err3 => {
                            console.error(`Error with unsubscribing user: ${err3}`);
                        });
                })
                .catch(err2 => {
                    console.error(`Error with push manager and subscription: ${err2}`);
                });
        })
        .catch(err => {
            console.error(`Service worker is not ready: ${err}`);
        });
}

function checkForSupport() {
    if (!('PushManager' in window)) {
        console.warn('Push notifications are not supported in this browser');
        return false;
    } else {
        console.warn('Push notifications are supported in this browser');
        return true;
    }
}

function checkForEnabled() {
    if (Notification.permission === 'denied') {
        console.warn('User has denied push notification access');
    }
}

function changeRenderingOfSubStatus(isSubbed) {
    let btn = document.querySelector('.push-note-btn');
    if (isSubbed) {
        btn.classList.remove('not-subbed');
        btn.classList.add('subbed');
    } else {
        btn.classList.remove('subbed');
        btn.classList.add('not-subbed');
    }
}

function setUpPushBtn() {
    document.querySelector('.push-note-btn').addEventListener('click', e => {
        if (e.currentTarget.classList.contains('not-subbed')) {
            subscribeUser();
        } else {
            changeRenderingOfSubStatus(false);
            unsubscribeUser()
        }
    });
}

function readyPMs() {
    const isAvailable = checkForSupport();

    if (isAvailable && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                registration.pushManager.getSubscription()
                    .then(subscription => {
                        if (subscription) {
                            console.info('yes subscribed');
                            changeRenderingOfSubStatus(true);
                        } else {
                            console.info('not subscribed yet');
                            changeRenderingOfSubStatus(false);
                        }
                    })
                    .catch(err2 => {
                        console.error(`Problem with retrieving subscription state from push manager `, err2);
                    })
            })
            .catch(err => {
                console.error(`Problem with readying service worker `, err);
            });
    }
}
setUpPushBtn()
readyPMs();