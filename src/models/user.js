'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id : {
        type : String,
        required : true,
        unique : true,
        dropDups : true
    },
    token : String
});

userSchema.methods.partialRep = {
    _id : this._id,
    user_id : this.user_id
};

const User = mongoose.model('User', userSchema);

module.exports = {User};