const router = require('express').Router();
const commentController = require('../controllers/comment.controller');
const {
    readComment,
    createComment,
    updateComment,
    deleteComment
} = commentController;


/**
 * ---- Read Comments ----
 */
router.get('/read_comment', readComment);

/**
 * ---- Create Comment ----
 */
router.post('/make_comment', createComment);

/**
 * ---- Update Comment ----
 */
router.post('/update_comment', updateComment);

/**
 * ---- Delete Comment ----
 */
router.delete('/comment_delete', deleteComment);


module.exports = router;