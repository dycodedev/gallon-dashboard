'use strict';

module.exports = {
    list(req, res, next) {
        const user = req.user;
        const query = { 'account.userId': user.username };

        Devices.find(query, (err, devices) => {
            if (err) {
                return next(new Error('Failed to get device data'));
            }

            return res.ok(devices, 'List devices');
        });
    },

    delete(req, res, next) {
        const id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.redirect('/');
        }

        Devices.findOneAndRemove({ _id: new ObjectID(id) }, err => res.redirect('/'));
    },
};
