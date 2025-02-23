import { Router, Request, Response, NextFunction } from 'express';
import {
    authRoutes,
    userRoutes,
    postRoutes,
    commentRoutes,
    conversationRoutes,
    messageRoutes,
    likeRoutes,
    notificationRoutes,
    followRoutes
} from '../routes';
import { AuthMiddleware } from '../middlewares';

const router: Router = Router();

/**
 * ---- Routes For API Version 01 -----
 * Now moved API Rutes from /api/v1/ to /api/
 */
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/users', AuthMiddleware.verifyUser, userRoutes);
router.use('/api/v1/posts', AuthMiddleware.verifyUser, postRoutes);
router.use('/api/v1/comments', AuthMiddleware.verifyUser, commentRoutes);
router.use('/api/v1/likes', AuthMiddleware.verifyUser, likeRoutes);
router.use('/api/v1/notifications', AuthMiddleware.verifyUser, notificationRoutes);
router.use('/api/v1/follows', AuthMiddleware.verifyUser, followRoutes);

router.use('/api', AuthMiddleware.verifyUser, conversationRoutes);
router.use('/api', AuthMiddleware.verifyUser, messageRoutes);

/**
 * ---- Health Check for the application here ----
 * Checking for Health of application at very first time..
 */
router.get('/health', (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({
        message: 'Successful',
        data: {
            message: 'Server is up and running...'
        }
    });
});

/**
 * ---- Resource not found endpoint ----
 * Not Found of resource
 */
router.use("*", (_req: Request, res: Response, _next: NextFunction) => {
    res.status(404).send("Resource not found!");
});

export default router;