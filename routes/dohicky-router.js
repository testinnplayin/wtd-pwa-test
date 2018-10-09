'use strict';

const express = require('express');
const router = express.Router();

const {Dohicky} = require('../src/models/dohicky');

const {
    get404,
    get500
} = require('../src/handlers/error-handlers');

const {
    get200
} = require('../src/handlers/success-handlers');

router.get('/', (req, res) => {
    Dohicky
        .find()
        .exec()
        .then(dhs => {
            if (!dhs) {
                return get404(res, 'dohickies');
            }

            return get200(res, dhs, 'dohickies');
        })
        .catch(err => get500(res, err, `cannot fetch dohickhies`));
});

router.get('/:id', (req, res) => {
    Dohicky
        .findById(req.params.id)
        .exec()
        .then(dh => {
            if (!dh) {
                return get404(res, `dohicky of id ${req.params.id}`);
            }

            return get200(res, dh, 'dohicky');
        })
        .catch(err => get500(res, err, `cannot fetch dohicky of id ${req.params.id}`));
});

module.exports = router;