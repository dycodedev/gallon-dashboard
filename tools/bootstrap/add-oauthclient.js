
// Example:
// node tools/bootstrap/add-oauthclient "Mobile App" john

if (process.argv.length !== 4) {
    console.log('Usage: node add-user APPNAME USERNAME');
    process.exit(1);
}

var buildOrm = require('../../app/helpers/buildorm')();

global.config = require('../../config/' + (process.env.APPENV || 'dev.local'));
global._ = require('lodash');
global.async = require('async');

global.Utils = require('../../app/services/Utils');

buildOrm(function (err) {

    var username = process.argv[3];
    User.findOne({ $or: [{ email: username }, { username: username }] }, function (err, user) {
        if (err) return console.error(err);
        if (!user) return console.error('User with username: ' + username + ' is not found');

        var oauthClient = new OAuthClient({
            name: process.argv[2],
            user: user._id,
            trusted: true,
        });

        oauthClient.save(function (err) {
            if (err) return console.log(err);

            console.log('An app saved, a platform extend', oauthClient);

            process.exit();
        });
    });
});
