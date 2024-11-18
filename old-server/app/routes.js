const router = require("express").Router(),
    authRoutes = require('../routes/auth'),
    usersRoutes = require('../routes/users'),
    postsRoutes = require('../routes/posts'),
    commentsRoutes = require('../routes/comments'),
    conversationsRoutes = require('../routes/conversations'),
    messagesRoutes = require('../routes/messages');

// Middlewares..
const authenticate = require('../middleware/auth');

/**
 * ---- Routes For API Version 01 -----
 * Now moved API Rutes from /api/v1/ to /api/
 */
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/user', authenticate, usersRoutes);
router.use('/api/v1/post', authenticate, postsRoutes);
router.use('/api/v1/comment', authenticate, commentsRoutes);
// router.use('/api/v1/conversations', authenticate, conversationsRoutes);
// router.use('/api/v1/messages', authenticate, messagesRoutes);

// router.use('/api', authRoutes);
// router.use('/api', authenticate, usersRoutes);
// router.use('/api', authenticate, postsRoutes);
// router.use('/api', authenticate, commentsRoutes);
router.use('/api', authenticate, conversationsRoutes);
router.use('/api', authenticate, messagesRoutes);


/**
 * Checking for Health of application at very first time..
 */
router.get('/health', (_req, res) => {
    res.status(200).json({
        message: 'Successful'
    });
});

module.exports = router;