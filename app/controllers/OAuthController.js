var oauth2orize = require('oauth2orize');
var passport = require('passport');

var crypto = require('crypto');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

//Resource owner password
server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {

    console.log(client, username, password, scope);

    User.validate(username, password, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);

        // If user already created access token, we create new one and update existing
        // We stored hashed token so we don't know what we've sent
        OAuthAccessToken.findOne({user: user._id, client: client._id}, function(err, accessToken) {
            if (err) return done(err);
            if (accessToken) {

                OAuthRefreshToken.findOne({user: user._id, client: client._id}, function(err, refreshToken) {
                    if (err) return done(err);

                    // we assume refreshToken exists. we could create another if
                    accessToken.token = Utils.uid(128);
                    accessToken.updateExpirationDate();
                    accessToken.scope = scope ? scope : '';

                    refreshToken.token = Utils.uid(128);

                    accessToken.save(function(err) {
                        console.error(err);
                        if (err) return done(err);

                        refreshToken.save(function(err) {
                            if (err) return done(err);

                            done(null, accessToken.token, refreshToken.token, {expires_in: accessToken.expirationDate});
                        });
                    });

                });

            } else {

                var accessToken = new OAuthAccessToken({
                    token: Utils.uid(128),
                    client: client._id,
                    user: user._id,
                    scope: scope ? scope : '',
                });

                var refreshToken = new OAuthRefreshToken({
                    token: Utils.uid(128),
                    client: client._id,
                    user: user._id,
                });

                accessToken.save(function(err) {
                    console.error(err);
                    if (err) return done(err);

                    refreshToken.save(function(err) {
                        if (err) return done(err);

                        done(null, accessToken.token, refreshToken.token, {expires_in: accessToken.expirationDate});
                    });
                });

            }
        });

    });

}));

//Refresh Token
server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {

    var refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex');

    OAuthRefreshToken.findOne({tokenHash: refreshTokenHash}, function(err, token) {
        if (err) return done(err);
        if (!token) return done(null, false);
        if (client._id !== token.client) return done(null, false);

        OAuthAccessToken.findOne({user: token.user}, function(err, accessToken) {
            if (err) return done(err);
            if (!accessToken) return done(null, false);
            if (client._id !== accessToken.client) return done(null, false);

            accessToken.token = Utils.uid(128);
            accessToken.updateExpirationDate();
            accessToken.scope = scope ? scope : '';

            accessToken.save(function(err) {
                if (err) return done(err);

                done(null, accessToken.token, refreshToken, {expires_in: accessToken.expirationDate});
            });

        });

    });

}));

// token endpoint
exports.token = [
    passport.authenticate(['clientBasic'], { session: false }),
    server.token(),
    server.errorHandler(),
];

exports.bearer = [
    passport.authenticate('accessToken', { session: false }),
];
