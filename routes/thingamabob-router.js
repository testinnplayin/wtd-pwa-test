'use strict';

const express = require('express');
const router = express.Router();
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false }));
const jsonParser = bodyParser.json();

const {Thingamabob} = require('../src/models/thingamabob');

const {
    checkFor400,
    get404,
    get500
} = require('../src/handlers/error-handlers');
const {
    getSuccess
} = require('../src/handlers/success-handlers');

// GET requests

// GET all at /api/thingamabobs/
router.get('/', (req, res) => {
    const str = 'thingamabobs';

    Thingamabob
        .find()
        .exec()
        .then(thinggies => {
            if (!thinggies) {
                return get404(res, str);
            }

            return getSuccess(res, thinggies, str);
        })
        .catch(err => get500(res, err, `cannot fetch ${str}`));
});

// GET specific thingamabob at /api/thingamabobs/:id
router.get('/:id', (req, res) => {
    const str = 'thingamabob';

    Thingamabob
        .findById(req.params.id)
        .exec()
        .then(thinggy => {
            if (!thinggy) {
                return get404(res, `${str} ${req.param.id}`);
            }

            return getSuccess(res, thinggy, str);
        })
        .catch(err => get500(res, err, `cannot fetch ${str}`));
});



// POST requests

// POST a thingamabob at /api/thingamabobs
router.post('/', jsonParser, (req, res) => {
    const reqFields = ['awesome_field'],
        str = 'thingamabob';
    
    checkFor400(req, res, reqFields, str);

    Thingamabob
        .create(req.body)
        .then(newT => {
            return getSuccess(res, newT, str);
        })
        .catch(err => get500(res, err, `cannot create ${str}`));
});

module.exports = router;