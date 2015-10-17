
var crypto = require('crypto');

var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;

/**
 * This strategy is used to authenticate users based on an access token (aka a bearer token).
 */
passport.use('accessToken', new BearerStrategy(function(accessToken, done) {
    var accessTokenHash = crypto.createHash('sha1').update(accessToken).digest('hex');
    OAuthAccessToken.findOne({tokenHash: accessTokenHash}, function(err, token) {
        if (err) return done(err);
        if (!token) return done(null, false);
        if (new Date() > token.expirationDate) {
            OAuthAccessToken.remove({tokenHash: accessTokenHash}, function(err) { done(err); });
        } else {
            User.findOne({_id: token.user}, function(err, user) {
                if (err) return done(err);
                if (!user) return done(null, false);

                // no use of scopes for now
                var info = { scope: '*' };
                done(null, user, info);
            });
        }
    });
}));
