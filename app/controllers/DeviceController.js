'use strict';

const azureIot = require('azure-iothub');

function urlEncodedSas(sas) {
    let token = 'SharedAccessSignature ';
    token += 'sr=' + encodeURIComponent(sas.sr.toLowerCase()).toLowerCase();
    token += '&sig=' + encodeURIComponent(sas.sig);
    token += '&se=' + sas.se;

    return token;
}

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
                return res.ok(device.toObject(), 'Device is already exists');
            }

            return Devices.create(req.body, err => {
                if (err) {
                    return next(new Error('Failed to save device'));
                }

                return res.ok(req.body, 'Device is added');
            });
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

        registry.get(deviceId, (err, device, response) => {
            if (err) {
                // return next(new Error('Failed to get device data'));
                return res.status(500).end('Failed to get device data');
            }

            if (!device) {
                // return next(new Error('Device is not found'));
                return res.status(404).end('Device is not found');
            }

            const primaryKey = device.authentication.SymmetricKey.primaryKey;
            const expiry = Math.round(Date.now() / 1000) + (24 * 3600);
            const parsedConnStr = azureIot.ConnectionString.parse(connectionString);
            const uri = parsedConnStr.HostName + '/devices/' + deviceId;
            const sasObject = sas.create(uri, null, primaryKey, expiry);

            // console.log(sasObject, '\n', sasObject.toString());
            // return res.status(200).end(sasObject.toString());
            return res.status(200).end(urlEncodedSas(sasObject));
        });
    },
};
