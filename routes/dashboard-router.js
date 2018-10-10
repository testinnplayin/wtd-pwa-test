'use strict';

const express = require('express');
const router = express.Router();

const {Dohicky} = require('../src/models/dohicky');
const {Thingamabob} = require('../src/models/thingamabob');

const {
    get400,
    get404,
    get500
} = require('../src/handlers/error-handlers');

const {getSuccess} = require('../src/handlers/success-handlers');

function successCase(res, count, type) {
    return res.status(200).json({ count : count, type : type });
}

// Count requests

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

// Table requests

router.get('/thingamabobs/table', (req, res) => {
    const str = 'thingamabobs';

    Thingamabob
        .find()
        .exec()
        .then(thinggies => {
            const str2 = 'dohickies';
            if (!thinggies) {
                return get404(res, `${str} for table data`);
            }

            const thingIds = thinggies.map(thinggy => thinggy._id);

            Dohicky
                .find({ thingamabob_id : { $in : thingIds } })
                .populate('thingamabob_id ')
                .then(dohs => {
                    if (!dohs) {
                        return get404(res, `${str2} linked to ${str} for table data`);
                    }

                    return getSuccess(res, dohs, `dohickies`, 200);
                })
                .catch(err => get500(res, err, `cannot fetch table data for linked ${str2}`));
        })
        .catch(err => get500(res, err, `cannot fetch ${str} for table data`));
});

router.get('/dohickies/table', (req, res) => {
    const str = 'dohickies';

    Dohicky
        .find()
        .populate('thingamabob_id')
        .exec()
        .then(dohs => {
            if (!dohs) {
                return get400(res, `${str} for table data`);
            }

            return getSuccess(res, dohs, str, 200);
        })
        .catch(err => get500(res, err, `cannot fetch ${str} for table data`));
});

module.exports = router;