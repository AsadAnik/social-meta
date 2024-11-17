import { Request, Response, NextFunction } from 'express';
import { User } from '../models';

/**
 * ---- Show All Users ----
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 * @param {NextFunction} next 
 */
const showUsersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({});
        if (!users) return res.status(400).json({ success: false, message: 'No users found' });

        // Bring new users into the array to security purpose..
        const newUsers = users.map((user: any) => ({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            title: user.title,
            profilePhoto: user.profilePhoto
        }));

        // Sends all of the users..
        res.status(200).json({
            success: true,
            users: newUsers
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ---- Update Application's Color Mode ----
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
const updateColorMode = async (req: Request, res: Response) => {
    const userId = req.user._id;
    const colorMode = req.query.colorMode;

    try {
        const updatedUser = await User.findByIdAndUpdate({ _id: userId }, { colorMode: colorMode }, { new: true });
        if (!updatedUser) return res.status(404).json({ isUpdate: false, message: 'User not found' });

        res.status(200).json({
            isUpdate: true,
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            isUpdate: false,
            error: error.message
        });
    }
};

/**
 * ---- User's theme mode update -----
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
const updateThemeMode = async (req: Request, res: Response) => {
    const userId = req.user._id;
    const themeMode = req.query.themeMode;

    try {
        const updatedUser = await User.findByIdAndUpdate({ _id: userId }, { themeMode: themeMode }, { new: true });
        if (!updatedUser) return res.status(404).json({ isUpdate: false, message: 'User not found' });

        res.status(200).json({
            isUpdate: true,
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            isUpdate: false,
            error: error?.message 
        });
    }
};

/**
 * ----- Find Profile By id ----
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
const profileById = async (req: Request, res: Response) => {
    const userId = req.query.userId;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ isUserFound: false, message: "User not found!" });

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
                followings: user.followings,
                followers: user.followers
            }
        });
    } catch (error) {
        res.status(500).json({
            isUserFound: false,
            error: error.message
        });
    }
};

/**
 * ---- Find User By OwnerId ----
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
const postOwner = async (req: Request, res: Response) => {
    const ownerId = req.query.ownerId;

    try {
        const user = await User.findById(ownerId);
        if (!user) return res.status(404).json({ isUserFound: false, message: "User not found!" });

        res.status(200).json({
            isUserFound: true,
            foundUser: {
                firstname: user.firstname,
                lastname: user.lastname,
                profilePhoto: user.profilePhoto,
                title: user.title
            }
        });
    } catch (error) {
        res.status(500).json({
            isUserFound: false,
            error: error.message
        });
    }
};

/**
 * ---- User's Profile ----
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
const profile = (req: Request, res: Response) => {
    res.status(200).json({
        isAuth: true,
        id: req.user._id,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        title: req.user.title,
        email: req.user.email,
        bio: req.user.bio,
        profilePhoto: req.user.profilePhoto,
        coverPhoto: req.user.coverPhoto,
        birthdate: req.user.birthdate,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt
    });
};

/**
 * ---- Profile (Auth) ----
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
const profileAuth = (req: Request, res: Response) => {
    res.status(200).json({
        isAuth: true,
        id: req.user._id,
        email: req.user.email,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        title: req.user.title,
        profilePhoto: req.user.profilePhoto,
        themeMode: req.user.themeMode,
        colorMode: req.user.colorMode,
        // token: req.user.token
    });
};

/**
 * ---- Uploading profile pic and update mongo users data ----
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
const uploadProfilePic = async (req: Request, res: Response) => {
    const userId = req.body.id;
    const fileName = req.file.originalname;

    try {
        const user = await User.findByIdAndUpdate({ _id: userId }, { profilePhoto: fileName }, { new: true });
        if (!user) return res.status(404).json({ isUpdate: false, message: 'User not found!' });

        res.status(200).json({
            isUpdate: true,
            message: 'User updated and added profile.',
            user
        });
    } catch (error) {
        res.status(500).json({
            isUpdate: false,
            error: error.message
        });
    }
};

module.exports = {
    showUsersController,
    updateColorMode,
    updateThemeMode,
    profileById,
    postOwner,
    profile,
    profileAuth,
    uploadProfilePic
};