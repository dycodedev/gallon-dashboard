
// This REPL will load all Mongoose models defined in app/models
// Append ;0; at the end of query to hide mongoose object return

global._ = require('lodash');
global.async = require('async');
global.config = require('../config/' + (process.env.APPCONFIG || 'dev.local'));
global.ObjectID = require('mongodb').ObjectID;
global.Utils = require('../app/services/Utils');

const initialize = require('../app/helpers/initialize')();

initialize((err, result) => {
    repl = require('repl').start({prompt: 'App> '});
    console.log('REPL started with Mongoose models loaded, press enter to continue');
});
