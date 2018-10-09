const mongoose = require('mongoose');

const thingamabobSchema = mongoose.Schema({
    awesome_field : {
        type : String,
        default : null
    }
});

const Thingamabob = mongoose.model('Thingamabob', thingamabobSchema);

module.exports = {Thingamabob};