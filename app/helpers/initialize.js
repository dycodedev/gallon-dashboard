
var passport = require('./passport');
var moduleLoader = require('./moduleloader');
var buildOrm = require('./buildorm')();

module.exports = function() {

    return function initialize(cb) {

        async.auto({
            loadStrategies: function(cb) {
                moduleLoader.loadStrategies(cb);
            },

            loadControllers: function(cb) {
                moduleLoader.loadController(cb);
            },

            loadServices: function(cb) {
                moduleLoader.loadServices(cb);
            },

            loadModels: function(cb) {
                buildOrm(cb);
            },
        }, cb);

    };

};
