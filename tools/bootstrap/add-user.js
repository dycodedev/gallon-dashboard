
// Example:
// node tools/bootstrap/add-user john "John Wick" john@dycode.com test1234 user
// node tools/bootstrap/add-user jane "Jane Wick" jane@dycode.com test1234 user,developer
// node tools/bootstrap/add-user admin "Admin Wick" admin@dycode.com test1234 admin

if (process.argv.length !== 7) {
    console.log('Usage: node add-user USERNAME FULLNAME EMAIL PASSWORD ROLE');
    process.exit(1);
}

var buildOrm = require('../../app/helpers/buildorm')();

global.config = require('../../config/' + (process.env.APPENV || 'dev.local'));
global._ = require('lodash');
global.async = require('async');

global.Utils = require('../../app/services/Utils');

buildOrm(function (err) {

    var user = new User({
        username: process.argv[2],
        fullname: process.argv[3],
        email: process.argv[4],
        role: process.argv[6].trim().split(','),
        password: process.argv[5],
        passwordConfirmation: process.argv[5],
    });

    user.save(function (err) {
        if (err) {
            console.log(err);
        };

        console.log('A user saved, a platform live', user);

        process.exit();
    });

});
