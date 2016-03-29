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

    addApi(req, res, next) {
        if (!Utils.hasProperty(req.body, ['device', 'attr', 'config'])) {
            return next(new Error('Some required parameters are missing'));
        }

        if (!req.body.device.id) {
            return next(new Error('Device ID must be provided'));
        }

        if (!Utils.hasProperty(req.body, ['account'])) {
            req.body.account = {
                userId: req.user.username,
                userToken: req.query.access_token,
            };
        }

        const query = {
            'device.id': req.body.device.id,
        };

        Device.findOne(query, (err, device) => {
            if (err) {
                return next(new Error('Failed to look for device'));
            }

            if (device) {
                return res.ok(null, 'Device is already exists');
            }

            return Device.insert(req.body, err => {
                if (err) {
                    return next(new Error('Failed to save device'));
                }

                return res.ok(req.body, 'Device is added');
            });
        });
    },

    delete(req, res, next) {
        const id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.redirect('/');
        }

        Devices.findOneAndRemove({ _id: new ObjectID(id) }, err => res.redirect('/'));
    },

    removeApi(req, res, next) {
        const query = {
            'account.userId': req.user.username,
            'device.id': req.params.id,
        };

        Devices.findOneAndRemove(query, err => {
            if (err) {
                return next(new Error('Failed to remove device'));
            }

            return res.ok(null, 'Device is removed');
        });
    },
};
