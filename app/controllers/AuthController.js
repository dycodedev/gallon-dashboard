'use strict';

const passport = require('passport');

module.exports = {
    signIn(req, res, next) {
        const model = res.baseModel;
        model.error = req.flash('authError').pop();

        return res.render('login', model);
    },

    postSignIn(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                req.flash('authError', 'Incorrect username or password');

                return res.redirect('/signin');
            }

            req.login(user, err => {
                if (err) {
                    return next(err);
                }

                return res.redirect('/');
            });
        })(req, res);
    },

    signOut(req, res, next) {
        req.session.destroy(err => console.error);

        return res.redirect('/signin');
    },
};
