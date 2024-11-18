const multer = require('multer');

// creating storage to uploading profile images path..
const storage = multer.diskStorage({
    destination: "./client/public/profileUpload/",
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage});

module.exports = upload;