import express, { Request, Response, NextFunction } from 'express';
import { profileUpload } from '../middlewares';
import { UserController, AuthController } from '../controllers';
import { User } from '../models';

const router = express.Router();

// Object instance for UserController Class..
const userController = new UserController();
const authController = new AuthController();

/**
 * ---- Get Friends by User ID ----
 */
router.get('/friends/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        const friends = await Promise.all(
            (user?.followings || []).map((friendId: string) => {
                return User.findById(friendId);
            })
        );

        let friendList: { _id: string; firstname: string; lastname: string; profilePhoto: string }[] = [];
        friends.forEach(friend => {
            const { _id, firstname, lastname, profilePhoto } = friend as any;
            friendList.push({ _id, firstname, lastname, profilePhoto });
        });
        res.status(200).json(friendList);

    } catch (error) {
        res.status(500).json(error);
    }
});

/**
 * ---- Get All Users ----
 */
router.get('/read_all_users', userController.showUsersController);

/**
 * ---- Get Profile By Id ----
 */
router.get('/profile_by_id', userController.profileById);

/**
 * ---- Get User of Owner ----
 */
router.get('/find_user', userController.postOwner);

/**
 * ---- Get Profile ----
 */
router.get('/profile', userController.profile);

/**
 * ---- Get Profile (Auth) ----
 */
router.get('/auth', userController.profileAuth);

/**
 * ---- Update Color Mode ----
 */
router.post('/user_colorMode_update', userController.updateColorMode);

/**
 * ---- User's Theme Mode Update ----
 */
router.post('/user_themeMode_updateName', userController.updateThemeMode);

/**
 * ---- Upload Profile Pic and Update Mongo Users Data ----
 */
router.post('/profile_upload', profileUpload.single("file"), userController.uploadProfilePic);

/**
 * ---- Get Logout User ----
 */
router.get('/logout', authController.logout);

export default router;