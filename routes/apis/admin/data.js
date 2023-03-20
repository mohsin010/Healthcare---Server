const DataController = require('../../../controllers/admin/data');
const express = require('express');
const router = express.Router();
const cors = require('cors');

const upload = require('../../../middleware/multer');

router.post('/storedata', upload.any(1), DataController.uploadData.bind(DataController));
router.post('/getowndata', DataController.getOwnData.bind(DataController));
router.post('/downloaddata', cors({
    exposedHeaders: ['Content-Disposition'],
}), DataController.downloadData.bind(DataController));



module.exports = router;
