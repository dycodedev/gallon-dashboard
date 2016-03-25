
var passport = require('passport');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id).exec(function (err, user) {
        if (user) {
            const transformed = user.toObject();
            delete transformed.passwordHash;

            return done(null, transformed);
        } else {
            return done(new Error('Invalid login data'));
        }
    });
});
