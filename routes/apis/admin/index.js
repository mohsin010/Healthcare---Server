const express = require('express');
const router = express.Router();

const dataRoutes = require('./data');
const deviceRoutes = require('./device');

router.use('/data', dataRoutes);
router.use('/device', deviceRoutes);

module.exports = router;