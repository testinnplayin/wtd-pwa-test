'use strict';

const express = require('express');
const app = express();

const path = require('path');
const fs = require('fs');

const https_options = {
    key : fs.readFileSync((path.join(__dirname, './certs', 'device.key')), 'utf-8'),
    cert : fs.readFileSync((path.join(__dirname, './certs', 'device.crt')), 'utf-8'),
    requestCert : false
};

const https = require('https').Server(https_options, app);

// const admin = require('firebase-admin');
// const serviceAccount = require('./thingamabobs-95715-firebase-adminsdk-69w92-99e8cdb405.json');
const firebase = require('firebase');
// admin.initializeApp({
//     credential : admin.credential.cert(serviceAccount),
//     databaseURL : "https://thingamabobs-95715.firebaseio.com"
// });

const cors = require('cors');
const arrOrigins = [
    // 'http://localhost:5000',
    "http://localhost:8080",
    "https://localhost:8080",
    "http://localhost:8081",
    'http://localhost:3000',
    'https://localhost:3000',
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

const io = require('socket.io')(https);

const {dbURL, fConfig, port} = require('./config');
const config = fConfig.config;
firebase.initializeApp(config);

const {activateDohicky} = require('./events/dohicky-events');

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

app.use('*', (req, res) => {
    return res.status(404).json({ message : 'Path not found' });
});

mongoose.set('useFindAndModify', false);

mongoose.connect(dbURL, { useNewUrlParser : true })
    .then(() => {
        console.log('---- Connecting to database ----');
        https.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch(err => console.error(`---- Error connecting to database : ${err} ----`));

io.on('connection', function(socket) {
    console.log('Client has connected to socket ', socket.id);
    // console.log('sockets opened ', io.sockets.sockets);

    activateDohicky(socket);

    socket.on('disconnect', function() {
        console.log('Client has disconnected ', socket.id);
    })
});