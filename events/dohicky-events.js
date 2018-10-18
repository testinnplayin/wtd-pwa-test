const io = require('socket.io');
const mongoose = require('mongoose');

const {Dohicky} = require('../src/models/dohicky');

const {stopWhatLoop, triggerWhatCreation} = require('../src/whatchamagigger/what-generator');

function activateDohicky(socket) {
    console.log('activateDohicky triggered ', socket.id);

    socket.on('ACTIVATE_DOHICKY', function (data) {
        const str = 'dohicky';

        Dohicky
            .findOneAndUpdate({ _id : mongoose.Types.ObjectId(data._id) }, { $set : data }, { new : true })
            .then(doh => {
                if (!doh) {
                    socket.emit('ACTIVATE_DOH_ERROR', { message : `Cannot find ${str} of id ${data._id}`});
                }

                console.log('doh active ', (doh.is_active) ? 'true' : 'false');

                (doh.is_active) ? triggerWhatCreation(doh, socket) : stopWhatLoop();
                
                socket.emit('ACTIVATE_DOH_SUCCESS', { [str]: doh });
            })
            .catch(err => socket.emit('ACTIVATE_DOH_ERROR', { message : `Cannot trigger ${str}: ${err}`}));
    });
}

module.exports = {activateDohicky};