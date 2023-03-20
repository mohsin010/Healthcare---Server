const AuthController = require('../../../controllers/admin/auth');
const express = require('express');
const router = express.Router();

router.post('/login', AuthController.login.bind(AuthController));
router.post('/signup', AuthController.signup.bind(AuthController));


module.exports = router;
