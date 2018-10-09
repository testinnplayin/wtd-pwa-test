'use strict';

const express = require('express');
const router = express.Router();

const {Dohicky} = require('../src/models/dohicky');
const {Thingamabob} = require('../src/models/thingamabob');

const {
    get400,
    get500
} = require('../src/handlers/error-handlers');

function successCase(res, count, type) {
    return res.status(200).json({ count : count, type : type });
}

router.get('/thingamabobs/count', (req, res) => {
    const str = 'thingamabobs';

    Thingamabob
        .find({})
        .countDocuments()
        .exec()
        .then(count => {
            if (!count || count === 'null' || count === 'undefined') {
                return get400(res, str);
            }

            return successCase(res, count, str);
        })
        .catch(err => get500(res, err, `cannot fetch ${str} count`));
});

router.get('/dohickies/count', (req, res) => {
    const str = 'dohickies';

    Dohicky
        .find({})
        .countDocuments()
        .exec()
        .then(count => {
            if (!count || count === 'null' || count === 'undefined') {
                return get400(res, str);
            }

            return successCase(res, count, str);
        })
        .catch(err => get500(res, err, `cannot fetch ${str} count`));
});

module.exports = router;