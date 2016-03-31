'use strict';

const azureIot = require('azure-iothub');
const async = require('async');

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

        const body = req.body;
        const connectionString = config.iot.connectionString;
        const registry = azureIot.Registry.fromConnectionString(connectionString);
        const query = {
            'account.userId': req.user.username,
            'device.id': req.body.device.id,
        };

        async.waterfall([
            function checkAzureDevice(done) {
                return registry.get(body.device.id, (err, device) => {
                    debugger;
                    if (err || !device) {
                        debugger;
                        if (err.responseBody.indexOf('DeviceNotFound') >= 0) {
                            return done(null, true);
                        }

                        // real error
                        console.error(err.responseBody);

                        return done(new Error('Failed to get azure device'));
                    }

                    if (device) {
                        return done(null, false);
                    }
                });
            },

            function createAzureDevice(proceedCreate, done) {
                debugger;
                if (!proceedCreate) {
                    return done(null);
                }

                return registry.create({ deviceId: body.device.id }, (err, device) => {
                    debugger;
                    if (err) {
                        console.error(err.responseBody);

                        return done(new Error('Failed to create azure device'));
                    }

                    return done(null);
                });
            },

            function checkActualDevice(done) {
                Devices.findOne(query, (err, device) => {
                    debugger;
                    if (err) {
                        return done(new Error('Failed to get device data'));
                    }

                    if (device) {
                        return done(null, false, device.toObject());
                    }

                    return done(null, true, false);
                });
            },

            function createDevice(proceedCreate, device, done) {
                if (!proceedCreate) {
                    return done(null, device);
                }

                return Devices.create(body, err => {
                    if (err) {
                        return done(new Error('Failed to save device'));
                    }

                    return done(null, body);
                });
            },
        ],

        (err, finalResult) => {
            if (err) {
                return next(err);
            }

            return res.ok(finalResult, 'Device is added');
        });
    },

    delete(req, res, next) {
        const id = req.params.id;
        const query = {
            'device.id': id,
            'account.userId': req.user.username,
        };

        Devices.findOneAndRemove(query, err => res.redirect('/'));
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
        const connectionString = config.iot.connectionString;
        const sas = azureIot.SharedAccessSignature;
        const registry = azureIot.Registry.fromConnectionString(connectionString);
        const deviceId = req.params.id;

        function make(primaryKey, connectionString) {
            const expiry = Math.round(Date.now() / 1000) + (24 * 3600);
            const parsedConnStr = azureIot.ConnectionString.parse(connectionString);
            const uri = parsedConnStr.HostName + '/devices/' + deviceId;
            const sasObject = sas.create(uri, null, primaryKey, expiry);

            return {
                name: uri.split('.')[0],
                url: parsedConnStr.HostName,
                sasToken: sasObject.toString(),
                sasExpiry: expiry,
            };
        }

        registry.get(deviceId, (err, device, response) => {
            if (err || !device) {
                if (err.responseBody.indexOf('DeviceNotFound') >= 0) {
                    const created = {
                        deviceId: deviceId,
                    };

                    return registry.create(created, (err, newlyCreated) => {
                        if (err) {
                            return res.status(500).end('Failed to create device');
                        }

                        const primaryKey = newlyCreated.authentication.SymmetricKey.primaryKey;
                        const newDeviceSas = make(primaryKey, connectionString);

                        return res.status(200).end(JSON.stringify(newDeviceSas));
                    });
                }

                return res.status(500).end('Failed to get device data');
            }

            const generated = make(device.authentication.SymmetricKey.primaryKey, connectionString);

            return res.status(200).end(JSON.stringify(generated));
        });
    },
};
