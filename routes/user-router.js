'use strict';

const express = require('express');
const router = express.Router();
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false }));
const jsonParser = bodyParser.json();

const { User } = require('../src/models/user');

const { get404, get500 } = require('../src/handlers/error-handlers');
const { get204, getSuccess } = require('../src/handlers/success-handlers');

router.post('/', jsonParser, (req, res) => {
    console.log('USER POST ', req.body);
    User
        .create(req.body)
        .then(() => res.status(201).end())
        .catch(err => get500(res, err, `cannot create user: ${err}`));
});

router.delete('/:userId', (req, res) => {
    console.log('USER DELETE ', req.params.userId);
    User
        .findOneAndRemove({ user_id : req.params.userId })
        .then(r => {
            console.log('r ', r);
            return get204(res);
        })
        .catch(err => get500(res, err, `cannot delete user: ${err}`));
});

module.exports = router;