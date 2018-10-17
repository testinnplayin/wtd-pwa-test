const mongoose = require('mongoose');

const thingamabobSchema = mongoose.Schema({
    awesome_field : {
        type : String,
        default : null,
        required : true
    }
});

const Thingamabob = mongoose.model('Thingamabob', thingamabobSchema);

module.exports = {Thingamabob};