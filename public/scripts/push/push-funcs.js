import {pReqOpts, resources} from '../../api-res.js';

'use strict';

function createUser(userObj) {
    const endpnt = `${resources.bAddress}/api/${resources.u}`;
    let postObj = pReqOpts;
    postObj.body = JSON.stringify(userObj);
    const postReq = new Request(endpnt, postObj);

    fetch(postReq)
        .then(response => {
            console.log('response ', response);
        })
        .catch(err => {
            console.error(`Oops : ${err}`);
        })
}

function subscribeUser() {
    console.log('subscribeUser');
    navigator.serviceWorker.ready
        .then(registration => {
            if (!registration.pushManager) {
                console.warn('Browser does not support push notifications');
                return false;
            }

            registration.pushManager.subscribe({
                userVisibleOnly : true // makes sure user always sees push notifications that arrive
            })
                .then(subscription => {
                    toast('Subscribed successfully');
                    console.info('Push notification subscribed');
                    console.log('subscription');
                    changeRenderingOfSubStatus(true);
                })
                .catch(err2 => {
                    console.error(`Error subscribing user: ${err2}`);
                });
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
                            toast('Successfully unsubscribed');
                            console.info('Successfully unsubscribed from push notifications');
                            console.log('subscription post drop ', subscription);
                            changeRenderingOfSubStatus(true);
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