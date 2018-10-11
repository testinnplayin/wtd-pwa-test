'use strict';

const express = require('express');
const router = express.Router();
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false }));
const jsonParser = bodyParser.json();

const {Dohicky} = require('../src/models/dohicky');
const {Thingamabob} = require('../src/models/thingamabob');

const {
    checkFor400,
    get404,
    get500
} = require('../src/handlers/error-handlers');
const {
    get204,
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

            return getSuccess(res, thinggies, str, 200);
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

            return getSuccess(res, thinggy, str, 200);
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
            const anotherStr = 'dohicky';

            if (!newT || !newT.hasOwnProperty(_id)) {
                throw new Error(`problem with ${str} creation`);
            }

            const newDoh = {
                is_ok : true,
                thingamabob_id : newT._id,
                thingamabob_bp : newT
            };

            Dohicky
                .create(newDoh)
                .then(nD => {
                    if (!nD) throw new Error(`problem with ${anotherStr} creation`);

                    return res.status(201).json({ thingamabob : newT, dohicky : nD });
                })
                .catch(err => get500(res, err, `cannot create linked ${anotherStr}`));
        })
        .catch(err => get500(res, err, `cannot create ${str}`));
});

// DELETE requests

// DELETE (hard) at /api/thingamabobs/:id

router.delete('/:id', (req, res) => {
    const str = 'thingamabob';
    
    Thingamabob
        .delete(req.params.id)
        .then(r => {
            const str2 = 'dohicky';

            if (r.n === 0) {
                return get404(res, `${str} ${req.params.id}`);
            }

            Dohicky
                .findOneAndUpdate({ thingamabob_id : req.params.id }, { $set : { 'is_ok' : false } }, { new : true })
                .exec()
                .then(uD => {
                    if (!uD) {
                        return get404(res, `linked ${str2} for ${str} of id ${req.params.id}`);
                    }

                    return res.status(200).json({ [str2] : uD });
                })
        })
        .catch(err => get500(res, err, `cannot delete ${str} of id ${req.params.id}`));
});

module.exports = router;