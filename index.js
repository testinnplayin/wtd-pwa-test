'use strict';

const express = require('express');
const app = express();
const httpApp = express();

const path = require('path');
const fs = require('fs');

const https_options = {
    key : fs.readFileSync((path.join(__dirname, './certs', 'device.key')), 'utf-8'),
    cert : fs.readFileSync((path.join(__dirname, './certs', 'device.crt')), 'utf-8'),
    requestCert : false
};

const https = require('https').Server(https_options, app);
const http = require('http').createServer(httpApp);

// NOTE: the following is for testing with ngrok (be sure to get rid of the http-related code below)
// const http = require('http').createServer(app);


const cors = require('cors');
const arrOrigins = [
    // 'http://localhost:5000',
    "http://localhost:8080",
    "https://localhost:8080",
    "http://localhost:8081",
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
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

const dashboardRouter = require('./routes/dashboard-router');
const dohickyRouter = require('./routes/dohicky-router');
const thingamabobRouter = require('./routes/thingamabob-router');
const userRouter = require('./routes/user-router');
const whatchamagiggerRouter = require('./routes/whatchamagigger-router');

app.use(morgan('common'));

app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/dashboard', dashboardRouter);
app.use('/api/dohickies', dohickyRouter);
app.use('/api/thingamabobs', thingamabobRouter);
app.use('/api/users', userRouter);
app.use('/api/whatchamagiggers', whatchamagiggerRouter);

// HOME at index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// dohickies view
app.get('/list/dohickies', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/list.html'));
});

// thingamabobs view
app.get('/list/thingamabobs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/list.html'));
});

// whatchamagiggers view

app.get('/list/whatchamagiggers', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/list.html'));
});

app.use('*', (req, res) => {
    res.send(404).json({ message : 'Page not found' });
    // res.redirect(`https://${req.hostname}:${port}`);
});

mongoose.set('useFindAndModify', false);

mongoose.connect(dbURL, { useNewUrlParser : true })
    .then(() => {
        console.log('---- Connecting to database ----');

        // NOTE, this following code snippet is for testing with ngrok... needs to be in http
        // http.listen(port, () => {
        //     console.log(`HTTP server listening on port ${port}`);
        // });

        https.listen(port, () => {
            console.log(`HTTPS server listening on port ${port}`);
        });
    })
    .catch(err => console.error(`---- Error connecting to database : ${err} ----`));

// NOTE: deactivate the following http code when testing with ngrok
httpApp.use(cors(corsOptions));

httpApp.get('*', (req, res) => {
    res.redirect(`https://${req.hostname}:${port}`);
})

http.listen('3001', () => {
    console.log('---- HTTP server listening on port 3001 ----');
});