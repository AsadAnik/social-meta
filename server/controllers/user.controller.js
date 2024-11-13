const User = require('../models/user');
const upload = require('../config/multer');

/**
 * ---- Show All Users ----
 * @param {*} _req 
 * @param {*} res 
 * @param {*} _next 
 */
const showUsersController = function (_req, res, _next) {
    User.find({}, function (err, users) {
        if (err) return res.status(400).json({ success: false, err });

        // Bring new users into the array to security purpose..
        let newUsers = [];
        users.forEach((user) => {
            newUsers.push({
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                title: user.title,
                profilePhoto: user.profilePhoto
            });
        });

        // Sends all of the users..
        res.status(200).json({
            success: true,
            users
        });
    });
};

/**
 * ---- Update Application's Color Mode ----
 * @param {*} req 
 * @param {*} res 
 */
const updateColorMode = function (req, res) {
    const userId = req.user._id;
    const colorMode = req.query.colorMode;

    User.findByIdAndUpdate({ _id: userId }, { colorMode: colorMode }, { new: true })
        .then(docs => {
            res.status(200).json({
                isUpdate: true,
                docs
            });
        })
        .catch(error => res.json({
            isUpdate: false,
            error
        }));
};


/**
 * ---- User's theme mode update -----
 * @param {*} req 
 * @param {*} res 
 */
const updateThemeMode = function (req, res) {
    const userId = req.user._id;
    const themeMode = req.query.themeMode;

    User.findByIdAndUpdate({ _id: userId }, { themeMode: themeMode }, { new: true })
        .then(docs => {
            res.status(200).json({
                isUpdate: true,
                docs
            });
        })
        .catch(error => res.json({
            isUpdate: false,
            error
        }));
}


/**
 * ----- Find Profile By id ----
 * @param {*} req 
 * @param {*} res 
 */
const profileById = function (req, res) {
    const userId = req.query.userId;

    User.findById({ _id: userId }, (err, user) => {
        if (err) return res.json({ isUserFound: false, err });
        if (!user) return res.json({ isUserFound: false, message: "User not found!" });

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
    });
};

/**
 * ---- Find User By OwnerId ----
 * @param {*} req 
 * @param {*} res 
 */
const postOwner = function (req, res) {
    const ownerId = req.query.ownerId;

    User.findById({ _id: ownerId }, (error, user) => {
        if (error) return res.send(error);
        if (!user) return res.json({ isUserFound: false, message: "User not found!" });

        res.status(200).json({
            isUserFound: true,
            foundUser: {
                firstname: user.firstname,
                lastname: user.lastname,
                profilePhoto: user.profilePhoto,
                title: user.title
            }
        });
    });
};


/**
 * ---- User's Profile ----
 * @param {*} req 
 * @param {*} res 
 */
const profile = function (req, res) {
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
 * @param {*} req 
 * @param {*} res 
 */
const profileAuth = function (req, res) {
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


// /**
//  * ---- Uploading profile pic and update mongo users data ----
//  * @param {*} req 
//  * @param {*} res 
//  */
// const uploadProfilePic = function (req, res) {
//     const userId = req.body.id;
//     const fileName = req.file.originalname;

//     // findByIdAndUpdate with database..
//     User.findByIdAndUpdate({ _id: userId }, { profilePhoto: fileName }, (error, user) => {
//         if (error) return res.json({ isUpdate: false, error });
//         if (!user) return res.json({ isUpdate: false, message: 'User not found!' });

//         res.status(200).json({
//             isUpdate: true,
//             message: 'User updated and added profile.',
//             user
//         });
//     });
// };

/**
/**
 * ---- Upload Profile Picture and Update User Data ----
 * @param {*} req 
 * @param {*} res 
 */
const uploadProfilePic = async function (req, res) {
    const userId = req.body.id;  // Ensure userId is passed in the body

    // Check if userId is provided
    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Check if file is uploaded
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const profilePhotoUrl = req.file.path; // Assuming Cloudinary URL

    try {
        // Update user document with the profile photo URL
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePhoto: profilePhotoUrl },
            { new: true, select: 'firstname lastname email coverPhoto' } // Limit fields in response
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile photo updated successfully!',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * ---- Upload Cover Photo and Update User Data ----
 * @param {*} req 
 * @param {*} res 
 */
const uploadCoverPic = async function (req, res) {
    const userId = req.body.id;  // Accessing `userId` directly from req.body
    console.log('upload cover', userId);

    // Ensure `userId` is passed
    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Check if file is uploaded
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const coverPhotoUrl = req.file.path; // Cloudinary URL or local storage URL

    try {
        // Update user document with the cover photo URL
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { coverPhoto: coverPhotoUrl },
            { new: true, select: 'firstname lastname email coverPhoto' } // Limit fields in response
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }

        res.status(200).json({
            success: true,
            message: 'Cover photo updated successfully!',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
    uploadProfilePic,
    uploadCoverPic,
};