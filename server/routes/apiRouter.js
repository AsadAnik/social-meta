const express = require('express'),
    router = express.Router(),
    userController = require('../controllers/user.controller'),
    postController = require('../controllers/post.controller'),
    settingController = require('../controllers/setting.controller'),
    auth = require('../middleware/auth'),
    emailChecker = require('../middleware/emailCheck'),
    profileUpload = require('../middleware/profileUpload'),
    postUpload = require('../middleware/postUpload');


/**----
 * ---- GET REQUESTS ---- ..
 * ----**/
// Get Theme by userId..
router.get('/user_themeMode/get', auth, settingController.loadThemeByUserId);

// User Profile by id..
router.get('/profile_by_id', userController.profileById);

// Read Post..
router.get('/post_read', auth, postController.readPost);

// Get all Posts..
router.get('/read_all_posts', auth, postController.readAllPosts);

// Get User by OwnerId..
router.get('/find_user', auth, userController.postOwner);

// Forgot Password..
router.get('/forgot_password', userController.forgotPassword);

// User Profile..
router.get('/profile', auth, userController.profile);

// Profile (Auth)..
router.get('/auth', auth, userController.profileAuth);

// Current User Posts..
router.get('/current_user_posts', auth, postController.currentUserPosts);

// Showing specific User Posts..
router.get('/user_posts', postController.specificUserPosts);

// Logout User..
router.get('/logout', auth, userController.logout);


/**----
 * ---- POST REQUESTS ---- ..
 * ----**/
// Update themeMode..
router.post('/user_themeMode/update', auth, settingController.updateThemeMode);

// Make themeMode by user..
router.post('/user_themeMode', auth, settingController.selectThemeMode);

// Uploading profile pic and update mongo users data..
router.post('/profile_upload', profileUpload.single("file"), userController.uploadProfilePic);

// Login User..
router.post('/login', userController.login);

// Register User..
router.post('/register', emailChecker, userController.register);

// Create new Post..
router.post('/post_create', auth, postUpload.single("file"), postController.createPost);

// Update Post..
router.post('/post_update', postUpload.single("file"), postController.updatePost);

/**----
 * ----- DELETE REQUESTS ---- ..
 * ----**/
// Delete Post..
router.delete('/post_delete', postController.deletePost);


module.exports = router;
