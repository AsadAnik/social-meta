const router = require('express').Router();
const postUpload = require('../middleware/postUpload');
const postController = require('../controllers/post.controller');
const { 
    getLikes, 
    readPost, 
    readAllPosts, 
    currentUserPosts, 
    specificUserPosts,
    likePost,
    createPost,
    updatePost,
    deletePost,
    
} = postController;


/**
 * ---- Get Likes from Post ----
 */
router.get('/get_post_likes', getLikes);


/**
 * ---- Read Post ----
 */
router.get('/post_read', readPost);


/**
 * ---- Get all Posts ----
 */
router.get('/read_all_posts', readAllPosts);


/**
 * ----- Current User Posts -----
 */
router.get('/current_user_posts', currentUserPosts);


/**
 * ---- Showing specific User Posts ----
 */
router.get('/user_posts', specificUserPosts);


/**
 * ---- Make Like a Post ----
 */
router.post('/post_like', likePost);


/**
 * ----- Create new Post ----
 */
router.post('/post_create', postUpload.single("file"), createPost);

/**
 * ----- Update Post ----
 */
router.post('/post_update', postUpload.single("file"), updatePost);


/**
 * ---- Delete Post ----
 */
router.delete('/post_delete', deletePost);


module.exports = router;
