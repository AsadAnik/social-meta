const router = require('express').Router();
const profileUpload = require('../middleware/profileUpload');
const { uploadToCloudinary } = require('../config/CloudeService');
const {
    showUsersController,
    updateColorMode,
    updateThemeMode,
    profileById,
    postOwner,
    profile,
    profileAuth,
    uploadProfilePic,
    uploadCoverPic
} = require('../controllers/user.controller');
const { logout } = require('../controllers/auth.controller');

// temporary User Model here..
const User = require('../models/user');

/**
 * ==== The Testing API router and controller ====
 */
router.get('/friends/:userId', async function (req, res) {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        const friends = await Promise.all(
            user.followings.map((friendId) => {
                return User.findById(friendId);
            })
        );

        let friendList = [];
        friends.map(friend => {
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

// /**
//  * ---- Uploading profile pic and update mongo users data ----
//  */
// router.post('/profile_upload', profileUpload.single("file"), uploadProfilePic);

router.post('/upload/profile-pic', uploadProfilePic);
router.post('/upload/cover-pic', uploadCoverPic);
/**
 * ---- Get Logout User ----
 */
router.get('/logout', logout);


module.exports = router;