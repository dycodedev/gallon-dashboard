
var express = require('express');
var router = express.Router();

var auth = require('../middlewares/authenticated');
var multipart = require('../middlewares/multipart');
var base64image = require('../middlewares/base64image');

// Index
router.get('/', IndexController.index);

module.exports = router;
