const mongoose = require('mongoose');

const whatchamagiggerSchema = mongoose.Schema({
    is_ok : {
        type : Boolean,
        default : true
    },
    thingamabob_msg : {
        type : mongoose.Schema.Types.Mixed,
        default : null
    },
    parent_dohicky : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Dohicky'
    }
},
{
    timestamps : true
});

const Whatchamagigger = mongoose.model('Whatchamagigger', whatchamagiggerSchema);

module.exports = {Whatchamagigger};