import { Request, Response, NextFunction } from "express";
import Post from "../models/Post";
import { Types } from "mongoose";
import { LikeService, PostService } from '../services';

class PostController {
  private readonly likeService: LikeService;
  private readonly postService: PostService;

  constructor() {
    this.likeService = new LikeService();
    this.postService = new PostService();
  }

  /**
   * READ POST CONTROLLER
   * @param req
   * @param res
   * @returns
   */
  public async readPost(req: Request | any, res: Response | any, next: NextFunction) {
    const postId = req.query.postId;

    // find Post by PostId.
    try {
      const post = await this.postService.readPost(postId);
      if (!post) throw new Error("Post not found!");

      res.status(200).json({
        success: true,
        post,
      });

    } catch (error) {
      console.error(`Error in readPost controller: ${error}`);
      next(error);
    }
  }

  /**
   * READ ALL POSTS CONTROLLER
   * @param req
   * @param res
   */
  public readAllPosts = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 5 } = req.query;
      const pageNumber = Math.max(1, Number(page));
      const limitNumber = Math.max(1, Number(limit));
      // const skip = (pageNumber - 1) * limitNumber;

      // Fetch posts with populated user, filtering out those with non-existent users
      const posts = await this.postService.readAllPosts(pageNumber, limitNumber);
      if (!posts) res.status(400).json({ ...posts, success: false });

      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }

  /**
   * CURRENT USER POSTS CONTROLLER
   * @param req
   * @param res
   */
  public async currentUserPosts(req: Request, res: Response) {
    const currentLoggedInUserId = String((req as any).user?._id);

    try {
      const posts = await this.postService.currentUserPosts(currentLoggedInUserId);
      if (!posts?.length) res.status(400).json({ ...posts, success: false });
      res.status(200).send(posts);

    } catch (error) {
      res.status(400).send(error);
    }
  }

  /**
   * GET SPECIFIC USER POST CONTROLLER
   * @param req
   * @param res
   */
  public async specificUserPosts(req: Request, res: Response) {
    const userId = req.query.userId;

    try {
      const posts = await this.postService.specificUserPosts(userId as string);
      if (!posts?.length) res.status(400).json({ ...posts, success: false });
      res.status(200).send(posts);

    } catch (error) {
      res.status(400).send(error);
    }
  }

  /**
   * CREATE POST CONTROLLER
   * @param req
   * @param res
   */
  public createPost = async (req: Request, res: Response) => {
    const currentLoggedInUserId = String((req as any).user._id);
    const post: any = {
      body: req.body.content,
      // image: req.file?.originalname,
      ownerId: currentLoggedInUserId,
      user: new Types.ObjectId(currentLoggedInUserId),
    };

    // if there is new post image update file to make it up..
    // and if no new update image file so don't need update extra..
    if (req.file !== undefined) {
      post.image = req.file.originalname;
    }

    console.log('post', post);
    
    try {
      await this.postService.createPost(post);

      res.status(200).json({
        success: true,
        message: 'Post Created',
      });

    } catch (error) {
      res.json({ success: false, error });
    }
  }

  /**
   * UPDATE POST CONTROLLER
   * @param req
   * @param res
   */
  public async updatePost(req: Request, res: Response) {
    const id = req.body._id;
    const post = { ...req.body };

    // if there is new post image update file to make it up..
    // and if no new update image file so don't need update extra..
    if (req.file !== undefined) {
      post.image = req.file.originalname;
    }

    try {
      const docs = await this.postService.updatePost(id, post);
      if (!docs) throw new Error("Post Can not Update!");

      res.status(200).json({
        success: true,
        docs,
      });

    } catch (err) {
      res.status(400).json({
        success: false,
        err,
      });
    }
  }

  /**
   * DELETE POST CONTROLLER
   * @param req
   * @param res
   */
  public async deletePost(req: Request, res: Response) {
    const id = req.query.id;

    try {
      const docs = await this.postService.deletePost(id as string);
      if (!docs) throw new Error("Post Can not Delete!");

      res.status(200).json({
        success: true,
        docs,
      });

    } catch (err) {
      res.status(400).json({ deleted: false, err });
    }
  }
}

export default PostController;
