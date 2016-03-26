'use strict';

const express = require('express');
const router = express.Router();

router.get('/devices', OAuthController.bearer, DeviceController.list);

// Authentication & User data
router.post('/oauth2/signin', OAuthController.token);
router.get('/me', OAuthController.bearer, (req, res, next) => {
    res.ok(req.user, 'User data');
});

router.get('/triggers', OAuthController.bearer, TriggerController.list);
router.get('/triggers/:id', OAuthController.bearer, TriggerController.getOne);
router.post('/triggers', OAuthController.bearer, TriggerController.add);
router.delete('/triggers/:id', OAuthController.bearer, TriggerController.delete);
router.put('/triggers/:device', OAuthController.bearer, TriggerController.setAllThreshold);

module.exports = router;
