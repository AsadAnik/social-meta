import express from 'express';
import { UserController } from '../controllers';
import { imageUpload } from '../middlewares';

const router = express.Router();
const userController = new UserController();

// USER ROUTES
router.route('/').get(userController.showUsers).patch(userController.updateThemeMode);
router.route('/me').get(userController.profileAuth);
router.route('/:userId').get(userController.profileById);
router.patch('/update-photo', imageUpload.single("file"), userController.uploadProfilePic);
router.patch('/update-cover', imageUpload.single("file"), userController.uploadCoverPic);

export default router;
