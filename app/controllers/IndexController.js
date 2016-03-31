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

            model.devices = _.map(devices, dev => {
                const transformed = dev.toObject();

                if (transformed.attr.waterLevelPercent) {
                    // less likely to occur
                    if (transformed.attr.waterLevelPercent % 10 !== 0) {
                        const curWaterLevel = transformed.attr.waterLevelPercent;
                        transformed.level = Math.round(curWaterLevel / 10) * 10;
                    }
                }

                transformed.attr.stateString = parseInt(transformed.attr.state) === 0
                    ? 'OFF'
                    : 'ON';

                transformed.device.background = 'img_gallon_percentage_' +
                    (transformed.level || transformed.attr.waterLevelPercent) + '.png';

                return transformed;
            });

            model.devices = _.chunk(model.devices, 4);
            model.wsUrl = config.wsUrl;

            res.render('index', model);
        });
    },

    dashboard(req, res, next) {
        const model = res.baseModel;
        const websocketUrl = config.dashboard.websocketUrl;
        model.isAuth = req.isAuthenticated();
        model.deviceid = req.params.id;

        return Devices.findOne({ 'device.id': req.params.id }, (err, device) => {
            if (err) {
                console.error(err);

                return res.redirect('/');
            }

            if (!device) {
                return res.redirect('/');
            }

            model.device = device;

            const path = config.appDir + '/assets/template_dashboard.json';

            fs.readFile(path, (err, content) => {
                let boardString = content.toString();
                boardString = boardString.replace(/\<\% DEVICEID \%\>/g, model.deviceid);
                boardString = boardString.replace(/\<\% WEBSOCKETURL \%\>/g, websocketUrl);

                try {
                    model.board = JSON.parse(boardString);
                } catch (ex) {
                    model.board = {};
                }

                return res.render('freeboard', model);
            });
        });
    },

    saveBoard(req, res, next) {
        const definition = req.body.definition;

        if (_.isEmpty(definition)) {
            return next(new Error('Failed to save board. Reason: no definition'));
        }

        const filename = config.appDir + '/assets/template_dashboard.json';

        fs.writeFile(filename, definition, err => {
            if (err) {
                return next(err);
            }

            return res.ok(null, 'Dashboard is saved');
        });
    },
};

