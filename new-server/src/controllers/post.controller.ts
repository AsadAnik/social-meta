import { Request, Response } from 'express';
import Post from '../models/Post';

/**
 * ---- Update Post Like ----
 * @param {Request} req 
 * @param {Response} res 
 */
export const likePost = async (req: Request, res: Response) => {
    const postId = req.query.postId;
    const likes = req.query.likes;
    const post = new Post(req.body);

    // Adding like...
    post.likes = likes;

    try {
        const docs = await Post.findByIdAndUpdate({_id: postId}, post, { new: true });
        res.status(200).json({
            success: true,
            likes: docs.likes
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            err
        });
    }
};

/**
 * ---- Get Post Like ----
 * @param {Request} req 
 * @param {Response} res 
 */
export const getLikes = async (req: Request, res: Response) => {
    const postId = req.query.postId;

    try {
        const post = await Post.findById({_id: postId});
        if (!post) return res.json({success: false, message: 'Post not found!'});

        res.status(200).json({
            success: true,
            likes: post.likes
        });
    } catch (err) {
        res.json({success: false, err});
    }
};

/**
 * ---- Read Post ----
 * @param {Request} req 
 * @param {Response} res 
 */
export const readPost = async (req: Request, res: Response) => {
    const postId = req.query.postId;

    // find Post by PostId.
    try {
        const post = await Post.find({_id: postId})
            .populate("user", "firstname lastname profilePhoto title themeMode colorMode email")
            .populate({
                path: 'comments',
                options: {sort: {createdAt: -1}},
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'firstname lastname profilePhoto title themeMode colorMode email'
                }
            })
            .exec();

        if (!post) return res.json({success: false, message: 'Post not found!'});

        res.status(200).json({
            success: true,
            post
        });
    } catch (err) {
        res.json({success: false, err});
    }
};

/**
 * ---- Read all posts ----
 * @param {Request} _req 
 * @param {Response} res 
 */
export const readAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find({})
            .populate({
                path: 'comments',
                options: {sort: {createdAt: -1}},
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'firstname lastname profilePhoto title themeMode colorMode email'
                }
            })
            .sort([['createdAt', -1]])
            .exec();

        res.status(200).send(posts);
    } catch (err) {
        res.send(err);
    }
};

/**
 * ---- Posts by OwnerId (Current User's Post) ----
 * @param {Request} req 
 * @param {Response} res 
 */
export const currentUserPosts = async (req: Request, res: Response) => {
    const currentLoggedInUserId = String(req.user._id);

    try {
        const docs = await Post.find({ ownerId: currentLoggedInUserId })
            .populate({
                path: 'comments',
                options: {sort: {createdAt: -1}},
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'firstname lastname profilePhoto title themeMode colorMode email'
                }
            })
            .sort([['createdAt', -1]])
            .exec();

        res.status(200).send(docs);
    } catch (err) {
        res.status(400).send(err);
    }
};

/**
 * ---- Showing specific User Posts ----
 * @param {Request} req 
 * @param {Response} res 
 */
export const specificUserPosts = async (req: Request, res: Response) => {
    const userId = req.query.userId;

    try {
        const docs = await Post.find({ ownerId: userId }).populate('comments').exec();
        res.status(200).send(docs);
    } catch (err) {
        res.status(400).send(err);
    }
};

/**
 * ---- Create new Post ----
 * @param {Request} req 
 * @param {Response} res 
 */
export const createPost = async (req: Request, res: Response) => {
    const post = new Post(req.body);

    const currentLoggedInUserId = String(req.user._id);
    post.ownerId = currentLoggedInUserId;
    post.user = currentLoggedInUserId;

    // if there is new post image update file to make it up..
    // and if no new update image file so don't need update extra..
    if (req.file !== undefined){
        post.image = req.file.originalname;
    }

    try {
        const docs = await post.save();
        res.status(200).json({
            success: true,
            docs
        });
    } catch (error) {
        res.json({ success: false, error });
    }  
};

/**
 * ---- Update Post ----
 * @param {Request} req 
 * @param {Response} res 
 */
export const updatePost = async (req: Request, res: Response) => {
    const id = req.body._id;
    const post = new Post(req.body);

    // if there is new post image update file to make it up..
    // and if no new update image file so don't need update extra..
    if (req.file !== undefined){
        post.image = req.file.originalname;
    }

    try {
        const docs = await Post.findByIdAndUpdate({ _id: id }, post, { new: true });
        res.status(200).json({
            success: true,
            docs
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            err
        });
    }
};

/**
 * ---- Delete Post ----
 * @param {Request} req 
 * @param {Response} res 
 */
export const deletePost = async (req: Request, res: Response) => {
    const id = req.query.id;

    try {
        await Post.findByIdAndDelete(id);
        res.status(200).json({
            deleted: true
        });
    } catch (err) {
        res.status(400).json({deleted: false, err});
    }
};
