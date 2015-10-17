'use strict';

const express = require('express');
const router = express.Router();

router.post('/token', OAuthController.token);

module.exports = router;
