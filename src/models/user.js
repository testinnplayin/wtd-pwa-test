'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.Mixed,
        required : true,
        unique : true,
        dropDups : true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = {User};