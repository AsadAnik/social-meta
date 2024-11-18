const multer = require('multer');

// creating storage to uploading post image path..
const storage = multer.diskStorage({
    destination: "./client/public/postUpload/",
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

module.exports = upload;
