import { Request, Response, NextFunction } from "express";
import { User } from "../models";
import { BlobStorageUtils } from "../lib/shared";

class UserController {
    /**
     * ---- Show All Users ----
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
    public async showUsers(_req: Request, res: Response | any, next: NextFunction) {
        try {
            const users = await User.find({});
            if (!users) return res.status(400).json({ success: false, message: 'No users found' });

            const newUsers = users.map((user: any) => ({
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                title: user.title,
                profilePhoto: user.profilePhoto,
            }));

            res.status(200).json({
                success: true,
                users: newUsers,
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * ---- User's theme mode update -----
     * @param {Request} req
     * @param {Response} res
     */
    public async updateThemeMode(req: Request, res: Response | any) {
        const userId = (req as any).user._id;
        const themeMode = req.query.themeMode;

        try {
            const updatedUser = await User.findByIdAndUpdate(
                { _id: userId },
                { themeMode: themeMode },
                { new: true }
            );

            if (!updatedUser)
                return res
                    .status(404)
                    .json({ isUpdate: false, message: "User not found" });

            res.status(200).json({
                isUpdate: true,
                user: updatedUser,
            });

        } catch (error: any) {
            res.status(500).json({
                isUpdate: false,
                error: error?.message,
            });
        }
    }

    /**
     * ---- Find Profile By ID ----
     * @param {Request} req
     * @param {Response} res
     */
    public async profileById(req: Request, res: Response | any) {
        const userId = req.params.userId;

        try {
            const user = await User.findById(userId);

            if (!user)
                return res
                    .status(404)
                    .json({ isUserFound: false, message: "User not found!" });

            res.status(200).json({
                isUserFound: true,
                userById: {
                    userId: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    title: user.title,
                    profilePhoto: user.profilePhoto,
                    coverPhoto: user.coverPhoto,
                    email: user.email,
                    bio: user.bio,
                    birthdate: user.birthdate,
                    followings_count: user.followings_count,
                    followers_count: user.followers_count,
                },
            });

        } catch (error: any) {
            res.status(500).json({
                isUserFound: false,
                error: error.message,
            });
        }
    }

    /**
     * ---- Profile (Auth) ----
     * @param {Request} req
     * @param {Response} res
     */
    public profileAuth(req: Request, res: Response) {
        res.status(200).json({
            isAuth: true,
            id: (req as any).user._id,
            email: (req as any).user.email,
            firstname: (req as any).user.firstname,
            lastname: (req as any).user.lastname,
            title: (req as any).user.title,
            profilePhoto: (req as any).user.profilePhoto,
            themeMode: (req as any).user.themeMode,
            colorMode: (req as any).user.colorMode,
        });
    }

    /**
     * ---- Uploading profile pic and update mongo users data ----
     * @param {Request} req
     * @param {Response} res
     */
    public async uploadProfilePic(req: Request, res: Response | any) {
        try {
            const userId = (req as any).user?._id;
            if (!userId) {
                return res
                    .status(400)
                    .json({ success: false, message: "User ID is required" });
            }

            // Ensure a file is attached
            const file = req.file; // Your file should be available in `req.file`
            if (!file) {
                return res
                    .status(400)
                    .json({ success: false, message: "No file uploaded" });
            }

            // Upload file to Cloudinary
            const uploaded_secure_url = await BlobStorageUtils.uploadImage(
                file,
                "profile_uploads"
            );

            // Update user's profile picture
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePhoto: uploaded_secure_url },
                { new: true, select: "firstname lastname email profilePhoto" }
            );

            if (!updatedUser) {
                return res
                    .status(404)
                    .json({ success: false, message: "User not found!" });
            }

            res.status(200).json({
                success: true,
                message: "Profile photo updated successfully!",
                user: updatedUser,
            });

        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ success: false, message: error.message });

            } else {
                res.status(500).json({ success: false, message: "An unknown error occurred" });
            }
        }
    }

    /**
     * Upload cover picture
     */
    public async uploadCoverPic(req: Request, res: Response | any) {
        try {
            const userId = (req as any).user?._id;
            if (!userId) {
                return res
                    .status(400)
                    .json({ success: false, message: "User ID is required" });
            }

            const file = req.file;
            if (!file) {
                return res
                    .status(400)
                    .json({ success: false, message: "No file uploaded" });
            }

            const uploaded_secure_url = await BlobStorageUtils.uploadImage(file, "cover_uploads");

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { coverPhoto: uploaded_secure_url },
                { new: true, select: "firstname lastname email coverPhoto" }
            );

            if (!updatedUser) {
                return res
                    .status(404)
                    .json({ success: false, message: "User not found!" });
            }

            res.status(200).json({
                success: true,
                message: "Cover photo updated successfully!",
                user: updatedUser,
            });

        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ success: false, message: error.message });

            } else {
                res.status(500).json({ success: false, message: "An unknown error occurred" });
            }
        }
    }
}
export default UserController;
