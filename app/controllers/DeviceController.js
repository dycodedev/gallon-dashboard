'use strict';

module.exports = {
    list(req, res, next) {
        const user = req.user;
        const query = { 'account.userId': user.username };

        Devices.find(query, (err, devices) => {
            if (err) {
                return next(new Error('Failed to get device data'));
            }

            const mappedDevice = _.map(devices, dev => {
                const transformed = dev.toObject();

                if (transformed.device) {
                    transformed.device.lastUpdated = transformed.device.lastUpdated
                        ? new Date(transformed.device.lastUpdated * 1000).toISOString()
                        : new Date().toISOString();

                    transformed.device.lastReplaced = transformed.device.lastReplaced
                        ? new Date(transformed.device.lastReplaced * 1000).toISOString()
                        : new Date().toISOString();

                    transformed.device.timeToReplace = transformed.device.timeToReplace
                        ? new Date(transformed.device.timeToReplace * 1000).toISOString()
                        : new Date().toISOString();
                }

                return transformed;
            });

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
