import express, { Request, Response, NextFunction } from 'express';
import { profileUpload } from '../middlewares';
import {
    showUsersController,
    updateColorMode,
    updateThemeMode,
    profileById,
    postOwner,
    profile,
    profileAuth,
    uploadProfilePic
} from '../controllers/user.controller';
import { logout } from '../controllers/auth.controller';

// temporary User Model here..
import User from '../models/User';

/**
 * ==== The Testing API router and controller ====
 */
const router = express.Router();

router.get('/friends/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        const friends = await Promise.all(
            user.followings.map((friendId: string) => {
                return User.findById(friendId);
            })
        );

        let friendList: { _id: string; firstname: string; lastname: string; profilePhoto: string }[] = [];
        friends.forEach(friend => {
            const { _id, firstname, lastname, profilePhoto } = friend;
            friendList.push({ _id, firstname, lastname, profilePhoto });
        });
        res.status(200).json(friendList);

    } catch (error) {
        res.status(500).json(error);
    }
});

/**
 * ==== Get All Users ====
 */
router.get('/read_all_users', showUsersController);

/**
 * ---- Get Profile By Id ----
 */
router.get('/profile_by_id', profileById);

/**
 * ----- Get user of owner ----
 */
router.get('/find_user', postOwner);

/**
 * ---- Get profile ----
 */
router.get('/profile', profile);

/**
 * ---- Get Profile (Auth) -----
 */
router.get('/auth', profileAuth);

/**
 * ---- Update Color Mode ----
 */
router.post('/user_colorMode_update', updateColorMode);

/**
 * ---- User's themeMode update ----
 */
router.post('/user_themeMode_updateName', updateThemeMode);

/**
 * ---- Uploading profile pic and update mongo users data ----
 */
router.post('/profile_upload', profileUpload.single("file"), uploadProfilePic);

/**
 * ---- Get Logout User ----
 */
router.get('/logout', logout);

export default router;