'use strict';

const http = require('http');

module.exports = () => {

    function craft(data, message, status) {
        const response = {
            meta: {
                status: http.STATUS_CODES[status],
                code: status,
            },
        };

        if (message) response.meta.message = message;
        if (data != null) response.data = data;

        return response;
    }

    // Before routes
    app.use((req, res, next) => {

        req.locale = req.session.locale || config.i18n.defaultLocale;

        // set base model
        res.baseModel = {
            user: req.user,
            locale: req.locale,
            version: version,
        };

        // set accept
        req.wantsJSON = req.xhr || req.get('Accept').indexOf('html') < 0;

        // craft response
        res.craft = craft;

        // send crafted response
        res.ok = (data, message, status) => {
            status = status || 200;

            res.status(status).send(res.craft(data, message, status));
        };

        next();
    });

    // routes
    app.use('/', require('./web'));
    app.use('/oauth', require('./oauth'));
    app.use('/api', require('./api'));
    app.use('/test', require('./test'));

    // 404 handler
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use((err, req, res, next) => {

        const errSplitted = err.stack.split('\n');

        console.error({
            message: errSplitted[0],
            location: errSplitted[1].trim(),
            url: req.originalUrl,
        });

        if (err.message === 'Invalid login data') {
            req.logout();
            return res.redirect('/');
        }

        const status = err.status || 500;

        if (req.wantsJSON) {
            return res.ok(err.data, err.message, status);
        } else {
            const model = res.baseModel;
            Object.assign(model, craft(err.data, err.message, status));
            return res.render('errors/error', model);
        };

    });

};
