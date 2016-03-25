'use strict';

const fs = require('fs');

module.exports = {

    index(req, res, next) {
        const model = res.baseModel;
        model.error = req.flash('error').pop();
        const query = {
            'account.userId': req.user.username,
        };

        return Devices.find(query, (err, devices) => {
            if (err) {
                model.error = err.message;

                console.error(err);
            }

            model.devices = _.map(devices, dev => dev.toObject());

            res.render('index', model);
        });
    },

    dashboard(req, res, next) {
        const model = res.baseModel;
        model.isAuth = req.isAuthenticated();

        return Devices.findOne({ 'device.id': req.params.id }, (err, device) => {
            if (err) {
                console.error(err);

                return res.redirect('/');
            }

            if (!device) {
                return res.redirect('/');
            }

            model.device = device;

            const path = config.appDir + '/assets/' + req.params.id + '_dashboard.json';
            fs.readFile(path, (err, content) => {
                if (err) {
                    return res.redirect('/');
                }

                try {
                    model.board = JSON.parse(content);
                } catch (ex) {
                    model.board = {};
                }

                return res.render('freeboard', model);
            });
        });
    },

    saveBoard(req, res, next) {
        const definition = req.body.definition;
        const deviceid = req.body.deviceid;

        if (_.isEmpty(definition)) {
            return next(new Error('Failed to save board. Reason: no definition'));
        }

        const filename = config.appDir + '/assets/' + deviceid + '_dashboard.json';

        fs.writeFile(filename, definition, err => {
            if (err) {
                return next(err);
            }

            return res.ok(null, 'Dashboard is saved');
        });
    },
};

