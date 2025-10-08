import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { PostService } from '../services';

class PostController {
  private readonly postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  /**
   * READ POST CONTROLLER
   * @param req
   * @param res
   * @returns
   */
  public readPost = async (req: Request | any, res: Response | any, next: NextFunction) => {
    const postId = req.params.postId;

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
  public readAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 5 } = req.query;
      const pageNumber = Math.max(1, Number(page));
      const limitNumber = Math.max(1, Number(limit));
      // const skip = (pageNumber - 1) * limitNumber;

      // Fetch posts with populated user, filtering out those with non-existent users
      const posts = await this.postService.fetchAllPosts(pageNumber, limitNumber);
      if (!posts) res.status(400).json({ success: false, posts });

      res.status(200).json({
        success: true,
        ...posts,
      });

    } catch (error) {
      console.error(`Error in readAllPosts controller: ${error}`);
      next(error);
    }
  }

  /**
   * GET SPECIFIC USER POST CONTROLLER
   * @param req
   * @param res
   */
  public specificUserPosts = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    try {
      const posts = await this.postService.specificUserPosts(userId as string);
      if (!posts) res.status(400).json({ success: false, posts });

      res.status(200).send({
        success: true,
        ...posts
      });

    } catch (error) {
      console.error(`Error in readPost controller: ${error}`);
      next(error);
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
      content: req.body.content,
      // image: req.file?.originalname,
      ownerId: currentLoggedInUserId,
      user: new Types.ObjectId(currentLoggedInUserId),
    };

    // if there is new post image update file to make it up..
    // and if no new update image file so don't need update extra..
    if (req.file !== undefined) {
      post.image = req.file;
    }

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
  public updatePost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.postId;
    const post = { ...req.body };

    // if there is new post image update file to make it up..
    // and if no new update image file so don't need update extra..
    if (req.file !== undefined) {
      post.image = req.file;
    }

    try {
      const docs = await this.postService.updatePost(id, post);
      if (!docs) throw new Error("Post Can not Update!");

      res.status(200).json({
        success: true,
        docs,
      });

    } catch (error) {
      console.error(`Error when update post: ${error}`);
      next(error);
    }
  }

  /**
   * DELETE POST CONTROLLER
   * @param req
   * @param res
   */
  public deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.postId;

    try {
      const docs = await this.postService.deletePost(id as string);
      if (!docs) throw new Error("Post Can not Delete!");

      res.status(200).json({
        success: true,
        message: 'Post Deleted Successfully!',
      });

    } catch (error) {
      console.error(`Error when update post: ${error}`);
      next(error);
    }
  }
}

export default PostController;
