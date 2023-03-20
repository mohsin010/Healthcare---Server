const multer = require('multer');
// const uniqid = require('uniqid');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'static/temp/');
    },
    filename: (req, file, callback) => {

        let ext = '';

        if (file.mimetype == 'application/pdf') ext = '.pdf';
        else ext = path.extname(file.originalname);

        console.log(ext);
        console.log('path external name', (file.originalname))
        req.body.filename = file.originalname;
        console.log(req.body.filename)

        // callback(null, uniqid() + ext);
        callback(null, file.originalname);
    }
});

// const fileFilter = (req, file, callback) => {
// if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') callback(null, true);
// else callback(null, false);
// };

const upload = multer({
    storage: storage,
    // limits: { fileSize: 1024 * 1024 * 5 },
    // fileFilter: fileFilter
});

module.exports = upload;