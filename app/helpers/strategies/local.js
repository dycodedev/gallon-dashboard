'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
},
(username, password, done) => {
    User.validate(username, password, (err, user) => {
        if (err) {
            if (err.message.indexOf('Incorrect') >= 0) {
                return done(null, false);
            }

            return done(err);
        }

        return done(null, user);
    });
}));
