import multer from 'multer';

// creating storage to uploading profile images path..
const storage = multer.diskStorage({
    destination: "./client/public/profileUpload/",
    filename: function (_req: Express.Request, file: Express.Multer.File, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage});

export default upload;