'use strict';

module.exports = {

    index(req, res, next) {
        const model = res.baseModel;
        model.errors = req.flash('error');
        res.render('index', model);
    },

};

