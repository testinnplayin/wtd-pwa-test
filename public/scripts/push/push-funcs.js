(function(window) {
    'use strict';

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

    function subscribeUser() {
        console.log('subscribeUser');
    }

    function unsubscribeUser() {
        console.log('unsubscribeUser');
    }

    function setUpPushBtn() {
        document.querySelector('.push-note-btn').addEventListener('click', e => {
            if (e.currentTarget.classList.contains('not-subbed')) {
                changeRenderingOfSubStatus(true);
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
})(window);