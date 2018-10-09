'use strict';

const express = require('express');
const router = express.Router();

const {Whatchamagigger} = require('../src/models/whatchamagigger');

const {
    get404,
    get500
} = require('../src/handlers/error-handlers');

const {
    get200
} = require('../src/handlers/success-handlers');

router.get('/', (req, res) => {
    Whatchamagigger
        .find()
        .exec()
        .then(whats => {
            if (!whats) {
                return get404(res, 'whatchamagiggers');
            }
            
            return get200(res, whats, 'whatchamagiggers');
        })
        .catch(err => get500(res, err, `cannot fetch whatchamagiggers`));
});

router.get('/:id', (req, res) => {
    Whatchamagigger
        .findById(req.params.id)
        .exec()
        .then(what => {
            if (!what) {
                return get404(res, `whatchamagigger of id ${req.params.id}`);
            }

            return get200(res, what, 'whatchamagigger');
        })
        .catch(err => get500(res, err, `cannot fetch whatchamagigger of id ${req.params.id}`));
});

module.exports = router;