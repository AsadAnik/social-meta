import multer from 'multer';

// creating storage to uploading post image path..
const storage = multer.diskStorage({
    destination: "./client/public/postUpload/",
    filename: function (_req: Express.Request, file: Express.Multer.File, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

export default upload;
