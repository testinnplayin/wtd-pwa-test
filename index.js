'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');

const cors = require('cors');
const arrOrigins = [
    // 'http://localhost:5000',
    "http://localhost:8080",
    "https://localhost:8080",
    "http://localhost:8081",
    'http://localhost:3000',
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

const io = require('socket.io')(http);

const {dbURL, port} = require('./config');

const {activateDohicky} = require('./events/dohicky-events');

const dashboardRouter = require('./routes/dashboard-router');
const dohickyRouter = require('./routes/dohicky-router');
const thingamabobRouter = require('./routes/thingamabob-router');
const whatchamagiggerRouter = require('./routes/whatchamagigger-router');

app.use(morgan('common'));

app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/dashboard', dashboardRouter);
app.use('/api/dohickies', dohickyRouter);
app.use('/api/thingamabobs', thingamabobRouter);
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
        http.listen(port, () => {
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