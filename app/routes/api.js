'use strict';

const express = require('express');
const router = express.Router();

router.get('/devices', OAuthController.bearer, DeviceController.list);

// Authentication & User data
router.post('/oauth2/signin', OAuthController.token);
router.get('/me', OAuthController.bearer, (req, res, next) => {
    res.ok(req.user, 'User data');
});

router.post('/devices', OAuthController.bearer, DeviceController.addApi);
router.delete('/devices/:id', OAuthController.bearer, DeviceController.removeApi);

router.get('/devices/:id/sas', DeviceController.getSasToken);

router.get('/triggers/device/:device', OAuthController.bearer, TriggerController.list);
router.get('/triggers/:id', OAuthController.bearer, TriggerController.getOne);
router.post('/triggers', OAuthController.bearer, TriggerController.add);
router.delete('/triggers/:id', OAuthController.bearer, TriggerController.delete);
router.put('/triggers', OAuthController.bearer, TriggerController.setAllThreshold);

module.exports = router;
