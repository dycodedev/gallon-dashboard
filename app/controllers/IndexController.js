'use strict';

const fs = require('fs');

module.exports = {

    index(req, res, next) {
        const model = res.baseModel;
        model.errors = req.flash('error');
        res.render('index', model);
    },

    dashboard(req, res, next) {
        return res.render('freeboard');
    },

    saveBoard(req, res, next) {
        const definition = req.body.definition;

        if (_.isEmpty(definition)) {
            return next(new Error('Failed to save board. Reason: no definition'));
        }

        const filename = config.appDir + '/assets/dashboard.json';

        fs.writeFile(filename, definition, err => {
            if (err) {
                return next(err);
            }

            return res.ok(null, 'Dashboard is saved');
        });
    },
};

