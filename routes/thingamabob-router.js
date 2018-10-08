'use strict';

const express = require('express');
const router = express.Router();

const {Thingamabob} = require('../src/models/thingamabob');

const {
    get404,
    get500
} = require('../src/handlers/error-handlers');
const {
    get200
} = require('../src/handlers/success-handlers');

router.get('/', (req, res) => {
    Thingamabob
        .find()
        .exec()
        .then(thinggies => {
            if (!thinggies) {
                return get404(res, 'thingamabobs');
            }

            return get200(res, thinggies, 'thingamabobs');
        })
        .catch(err => get500(req, res, err, `cannot fetch thingamabobs`));
});

module.exports = router;