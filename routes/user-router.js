'use strict';

const express = require('express');
const router = express.Router();
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false }));
const jsonParser = bodyParser.json();

const { User } = require('../src/models/user');

router.post('/', jsonParser, (req, res) => {
    console.log('USER POST ', req.body);

});

module.exports = router;