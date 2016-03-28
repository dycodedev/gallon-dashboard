'use strict';

module.exports = {
    list(req, res, next) {
        const model = res.baseModel;
        model.error = req.flash('userError').pop();
        model.success = req.flash('userSuccess').pop();

        User.find({}).sort('-_id').exec((err, users) => {
            if (err) {
                console.error(err);

                model.error = 'Failed to get users data';
            }

            model.users = _.map(users, user => user.toObject());

            return res.render('users', model);
        });
    },

    add(req, res, next) {
        const model = res.baseModel;
        model.error = req.flash('userError').pop();
        model.success = req.flash('userSuccess').pop();

        return res.render('add_user', model);
    },

    postAdd(req, res, next) {
        const referer = req.headers.referer || '/users';
        const requiredFields = [
            'username',
            'fullname',
            'email',
            'password',
            'passwordConfirmation',
        ];

        if (!Utils.hasProperty(req.body, requiredFields)) {
            req.flash('userError', 'Required fields are missing');

            return res.redirect(referer);
        }

        const user = new User({
            username: req.body.username,
            fullname: req.body.fullname,
            email: req.body.email,
            role: ['user'],
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation,
        });

        user.save(err => {
            if (err) {
                console.error(err);
                req.flash('userError', 'Failed to save user');

                return res.redirect(referer);
            }

            req.flash('userSuccess', 'User is saved');

            return res.redirect(referer);
        });
    },
};
