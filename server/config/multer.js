// config/multer.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile_uploads',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

const upload = multer({ storage });

module.exports = upload;