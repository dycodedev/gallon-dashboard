
var passport = require('passport');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findOneById(id).exec(function (err, user) {
        if (user) {
            delete user.passwordHash;
            done(null, user);
        } else {
            done(new Error('Invalid login data'));
        }
    });
});
