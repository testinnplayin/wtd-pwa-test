'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id : {
        type : String,
        required : true,
        unique : true,
        dropDups : true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = {User};