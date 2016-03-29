'use strict';

module.exports = {
    list(req, res, next) {
        const query = {
            user: req.user.username,
        };

        return Triggers.find(query, (err, triggers) => {
            if (err) {
                return next(err);
            }

            return res.ok(_.map(triggers, trig => trig.toObject()), 'Triggers list');
        });
    },

    getOne(req, res, next) {
        const id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return new Error('Not a valid object id');
        }

        return Triggers.findOne({ _id: new ObjectID(id) }, (err, trigger) => {
            if (err) {
                return next(new Error('Failed to get trigger data'));
            }

            if (!trigger) {
                return res.ok(null, 'Trigger is not found');
            }

            return res.ok(trigger.toObject(), 'Trigger data');
        });
    },

    add(req, res, next) {
        const body = req.body;

        if (_.isEmpty(body)) {
            return next(new Error('Request body should not be empty'));
        }

        body.user = req.user.username;

        const requiredFields = ['threshold', 'action', 'triggerName', 'device'];

        if (!Utils.hasProperty(body, requiredFields)) {
            const error = new Error(requiredFields.toString() + ' fields are required');

            return next(error);
        }

        const requiredActionFields = ['to', 'alias', 'type', 'message'];

        if (!Utils.hasProperty(body.action, requiredActionFields)) {
            const error = new Error(`${requiredActionFields} fields of action field are required`);

            return next(error);
        }

        const trig = new Triggers(body);

        return trig.save(err => {
            if (err) {
                return next(new Error('Failed to save trigger'));
            }

            const query = {
                user: req.user.username,
                device: body.device,
            };

            const update = {
                threshold: body.threshold,
            };

            const opt = {
                multi: true,
            };

            Triggers.update(query, update, opt, err => {
                if (err) {
                    return next(new Error('Failed to update threshold'));
                }

                return res.ok(trig.toObject(), 'Trigger is saved');
            });
        });
    },

    setAllThreshold(req, res, next) {
        if (_.isEmpty(req.body.deviceid)) {
            const error = new Error('deviceid value must be provided');
            error.status = 400;

            return next(error);
        }

        if (!req.body.threshold && req.body.threshold !== 0) {
            const error = new Error('threshold value must be provided');
            error.status = 400;

            return next(error);
        }

        const query = {
            user: req.user.username,
            device: req.body.deviceid,
        };

        const opt = { multi: true };
        const update = {
            $set: {
                threshold: parseInt(req.body.threshold),
            },
        };

        return Triggers.update(query, update, opt, err => {
            if (err) {
                return next(new Error('Failed to update threshold'));
            }

            return res.ok(null, 'Threshold is updated');
        });
    },

    delete(req, res, next) {
        const id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return new Error('Not a valid object id');
        }

        return Triggers.findOneAndRemove({ _id: new ObjectID(id) }, (err, trigger) => {
            if (err) {
                return next(new Error('Failed to delete trigger data'));
            }

            return res.ok(null, 'Trigger data');
        });
    },
};
