'use strict';

const express = require('express');
const router = express.Router();

router.get('/', OAuthController.bearer, (req, res, next) => {
    res.ok({some: 'protected data'}, 'Node API. Maybe');
});

router.get('/me', OAuthController.bearer, (req, res, next) => {
    res.ok(req.user, 'User data');
});

module.exports = router;
