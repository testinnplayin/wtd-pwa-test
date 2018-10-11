'use strict';

const express = require('express');
const router = express.Router();

const {Dohicky} = require('../src/models/dohicky');

const {
    get404,
    get500
} = require('../src/handlers/error-handlers');

const {
    getSuccess
} = require('../src/handlers/success-handlers');

router.get('/', (req, res) => {
    Dohicky
        .find()
        .populate('thingamabob_id')
        .exec()
        .then(dhs => {
            if (!dhs) {
                return get404(res, 'dohickies');
            }

            return getSuccess(res, dhs, 'dohickies', 200);
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

            return getSuccess(res, dh, 'dohicky', 200);
        })
        .catch(err => get500(res, err, `cannot fetch dohicky of id ${req.params.id}`));
});

module.exports = router;