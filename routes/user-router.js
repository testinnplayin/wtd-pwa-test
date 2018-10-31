'use strict';

const express = require('express');
const router = express.Router();
const app = express();

const mongoose = require('mongoose');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false }));
const jsonParser = bodyParser.json();

const { User } = require('../src/models/user');

const { get404, get500 } = require('../src/handlers/error-handlers');
const { get204, getSuccess } = require('../src/handlers/success-handlers');

router.post('/', jsonParser, (req, res) => {
    User
        .create(req.body)
        .then(user => getSuccess(res, user, 'user', 201))
        .catch(err => get500(res, err, `cannot create user: ${err}`));
});

router.put('/token', jsonParser, (req, res) => {
    console.log('PUT user token ', req.body);
    const id = mongoose.Types.ObjectId(req.body._id);
    console.log('id ', id);
    User
        .findOneAndUpdate({ _id : id }, { $set : req.body }, { new : true })
        .then(nUser => {
            if (!nUser) {
                return get404(res, `user of id ${id}`);
            }
            console.log('nUser ', nUser);
            return get204(res);
        })
        .catch(err => get500(res, err, `cannot update token of user: ${err}`));
});

router.delete('/:userId', (req, res) => {
    User
        .findOneAndRemove({ user_id : req.params.userId })
        .then(r => {
            console.log('r ', r);
            return get204(res);
        })
        .catch(err => get500(res, err, `cannot delete user: ${err}`));
});

module.exports = router;