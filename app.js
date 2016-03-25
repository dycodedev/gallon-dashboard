'use strict';

// uncomment below to generate memory stats using memwatch
// npm install memwatch-next --save
// require('./tools/memwatch');

// uncomment below to use winston as logger
// npm install winston --save
// require('./tools/logger');

// node modules
const path = require('path');

const express = require('express');
const swig = require('swig');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session    = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const i18n = require('i18n');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

// global
global._ = require('lodash');
global.async = require('async');
global.config = require('./config/' + (process.env.APPENV || ''));
global.info = require('./package.json');
global.version = info.version;
global.ObjectID = require('mongodb').ObjectID;

const initialize = require('./app/helpers/initialize')();

// i18n
i18n.configure({
    locales: ['en_US', 'id'],
    directory: __dirname + '/app/locales',
    updateFiles: false,
});

// express setup
global.app = express();

// view engine setup
swig.setDefaults(config.swig);
app.engine('swig', swig.renderFile);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'swig');

app.disable('x-powered-by');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// initialize
initialize((err, result) => {

    app.use(session({
        name: 'nodeapp.sess',
        resave: false,
        saveUninitialized: false,
        secret: config.cookie.secret,
        autoReconnect: true,
        maxAge: new Date(Date.now() + 3600000),
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            collection: 'app_sessions',
        }),
    }));

    app.use(express.static(__dirname + '/assets'));
    app.use(express.static(__dirname + '/bower_components'));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(i18n.init);

    // routes
    require('./app/routes')();

    // start listening
    const port = config.port;
    const server = app.listen(port, () => {
        console.log('NodeApp server listening on port ' + port);
    });

});

// ups
process.on('uncaughtException', err => {
    console.error('uncaughtException', err.stack);
});
