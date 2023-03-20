const express = require('express');
const router = express.Router();

const authRoutes = require('./apis/login/auth');
const adminRoutes = require('./apis/admin/index');


router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);


module.exports = router;