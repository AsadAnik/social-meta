// services/cloudinaryService.js
const cloudinary = require('./cloudinary');

/**
 * Upload a file to Cloudinary.
 * @param {string} filePath 
 * @param {string} folder 
 * @returns {Promise<Object>}
 */
const uploadToCloudinary = async (filePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            allowed_formats: ['jpg', 'jpeg', 'png'],
        });
        return { success: true, ...result };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = {
    uploadToCloudinary,
};
