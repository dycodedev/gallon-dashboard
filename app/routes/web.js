
var express = require('express');
var router = express.Router();

var auth = require('../middlewares/authenticated');
var multipart = require('../middlewares/multipart');
var base64image = require('../middlewares/base64image');

// Index
router.get('/', auth.isAuthenticated(), IndexController.index);
router.get('/dashboard', IndexController.dashboard);
router.post('/dashboard', IndexController.saveBoard);

router.get('/signin', AuthController.signIn);
router.post('/signin', AuthController.postSignIn);
router.get('/signout', auth.isAuthenticated(), AuthController.signOut);

router.post('/triggers', auth.isAuthenticated(), TriggerController.add);
router.get('/triggers/:id', auth.isAuthenticated(), TriggerController.delete);

module.exports = router;
