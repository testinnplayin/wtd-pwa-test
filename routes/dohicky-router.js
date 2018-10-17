'use strict';

const express = require('express');
const router = express.Router();
const app = express();

const mongoose = require('mongoose');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false }));
const jsonParser = bodyParser.json();

const {Dohicky} = require('../src/models/dohicky');

const {
    get404,
    get500
} = require('../src/handlers/error-handlers');

const {
    getSuccess
} = require('../src/handlers/success-handlers');

const { stopWhatLoop, triggerWhatCreation } = require('../src/whatchamagigger/what-generator');


// HTTP requests

// GET requests

// GET all at /api/dohickies/
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

// GET specific dohicky at /api/dohickies/:id
router.get('/:id', (req, res) => {
    Dohicky
        .findById(req.params.id)
        .populate('thingamabob_id')
        .exec()
        .then(dh => {
            if (!dh) {
                return get404(res, `dohicky of id ${req.params.id}`);
            }

            return getSuccess(res, dh, 'dohicky', 200);
        })
        .catch(err => get500(res, err, `cannot fetch dohicky of id ${req.params.id}`));
});



// PUT request at /api/dohickies/:id

router.put('/:id', jsonParser, (req, res) => {
    console.log('PUT request ', req.body);
    const str = 'dohicky';

    Dohicky
        .findOneAndUpdate({ _id : mongoose.Types.ObjectId(req.params.id) }, { $set : req.body }, { new : true })
        .then(doh => {
            if (!doh) {
                return get404(res, `${str} of id ${req.params.id}`);
            }

            console.log('doh active ', (doh.is_active) ? 'true' : 'false');

            (doh.is_active) ? triggerWhatCreation(doh) : stopWhatLoop();
            
            return getSuccess(res, doh, str, 200);
        })
        .catch(err => get500(res, err, str));
});

module.exports = router;