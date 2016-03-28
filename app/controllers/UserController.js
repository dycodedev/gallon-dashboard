'use strict';

module.exports = {
    list(req, res, next) {
        const model = res.baseModel;
        model.error = req.flash('userError').pop();
        model.success = req.flash('userSuccess').pop();

        User.find({}).sort('-_id').exec((err, users) => {
            if (err) {
                console.error(err.stack);

                model.error = 'Failed to get users data';
            }

            model.users = _.map(users, user => user.toObject());

            return res.render('users', model);
        });
    },
};
