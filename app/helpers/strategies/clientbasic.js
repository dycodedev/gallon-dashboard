
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

/**
 * This strategy is used to authenticate registered OAuth clients.
 * The authentication data must be delivered using the basic authentication scheme.
 */
passport.use('clientBasic', new BasicStrategy(function (clientId, clientSecret, done) {

    console.log(clientId, clientSecret);

    OAuthClient.findOne({ _id: clientId }, function (err, clientApp) {

        console.log(clientApp);

        if (err) return done(err);
        if (!clientApp) return done(null, false);
        if (!clientApp.trusted) return done(null, false);

        if (clientApp.secret == clientSecret) return done(null, clientApp);
        else return done(null, false);
    });
}));
