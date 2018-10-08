'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);

const cors = require('cors');
const arrOrigins = [
    // 'http://localhost:5000',
    "http://localhost:8080",
    "https://localhost:8080",
    "http://localhost:8081",
    "localhost:8080",
    "*"
];

const corsOptions = {
    origin : arrOrigins,
    credentials : true,
    optionsSuccessStatus : 200,
    methods : [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'OPTIONS'
    ]
};

app.use(cors(corsOptions));

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const morgan = require('morgan');

const {dbURL, port} = require('./config');

app.use(morgan('common'));

app.use('*', (req, res) => {
    return res.status(404).json({ message : 'Path not found' });
});

mongoose.connect(dbURL, { useNewUrlParser : true })
    .then(() => {
        console.log('---- Connecting to database ----');
        http.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch(err => console.error(`---- Error connecting to database : ${err} ----`));

