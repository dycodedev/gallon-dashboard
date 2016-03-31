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

    getDeviceState(req, res, next) {
        const id = req.params.id;

        return Devices.findOne({ 'device.id': id }, (err, device) => {
            if (err) {
                return next(new Error('Failed to get device'));
            }

            if (!device) {
                console.log('DNF Triggered');
                return res.ok(null, 'Device is not found');
            }

            const newDevice = device.toObject();

            if (newDevice.attr) {
                return res.ok({ state: parseInt(newDevice.attr.state) }, 'Device state');
            } else {
                return res.ok(null, 'Device state is not found');
            }
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
            'account.userId': req.user.username,
            'device.id': req.body.device.id,
        };

        Devices.findOne(query, (err, device) => {
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

    getSasToken(req, res, next) {

    },
};
