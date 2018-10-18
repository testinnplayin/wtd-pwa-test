'use strict';

const mongoose = require('mongoose');

const dohickySchema = mongoose.Schema({
    is_ok : {
        type : Boolean,
        default : true
    },
    is_active : {
        type : Boolean,
        default : false
    },
    thingamabob_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Thingamabob',
        required : true
    },
    thingamabob_bp : mongoose.Schema.Types.Mixed
},
{ timestamps : true, collection : 'dohickies' });

const Dohicky = mongoose.model('Dohicky', dohickySchema);

module.exports = {Dohicky};