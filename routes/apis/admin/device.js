const DeviceController = require('../../../controllers/admin/device');
const express = require('express');
const router = express.Router();

router.post('/registerdevice', DeviceController.registerDevice.bind(DeviceController));
router.post('/getalldevices', DeviceController.getAllDevices.bind(DeviceController));
router.post('/deletedevice', DeviceController.deleteDevice.bind(DeviceController));

module.exports = router;
