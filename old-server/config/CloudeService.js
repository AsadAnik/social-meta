const cloudinary = require('../config/cloudinary');

/**
 * Upload file to Cloudinary
 * @param {Object} file - File object from request
 * @param {String} folder - Folder name in Cloudinary
 * @returns {Object} - Cloudinary upload result
 */
const uploadToCloudinary = async (file, folder) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: folder,
            resource_type: 'auto', // Automatically detect file type
        });
        return result;
    } catch (error) {
        throw new Error('Cloudinary upload failed: ' + error.message);
    }
};

module.exports = { uploadToCloudinary };
