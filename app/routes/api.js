'use strict';

const express = require('express');
const router = express.Router();

router.get('/devices', OAuthController.bearer, DeviceController.list);

// Authentication & User data
router.post('/oauth2/signin', OAuthController.token);
router.get('/me', OAuthController.bearer, (req, res, next) => {
    res.ok(req.user, 'User data');
});

module.exports = router;
