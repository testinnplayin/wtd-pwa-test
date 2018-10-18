export default {
    listenForWhat : function(socket) {
        socket.on('WHAT_CREATED', response => {
            console.log('What created! ', response);
            console.log(Notification.permission)
            if ('serviceWorker' in navigator && Notification.permission === 'granted') {
                navigator.serviceWorker.getRegistration()
                    .then(registration => {
                        console.log('got registered sw ', registration);
                        const options = {
                            body : `New whatchamagigger created for thingamabob ${response.thingamabob_msg}`
                        };
                        registration.showNotification('New Whatchamagigger', options);
                    })
                    .catch(err => console.error(`Error: ${err}`));
            }
        });
    }
};