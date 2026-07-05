const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

/**
 * Uploads a file buffer directly to Cloudinary.
 * Used with memoryStorage from multer.
 * 
 * @param {Buffer} buffer - The image buffer to upload
 * @param {string} folder - The folder name in Cloudinary
 * @returns {Promise<Object>} The Cloudinary upload result object
 */
const uploadToCloudinary = (buffer, folder = 'code_clash_profiles') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    // Write buffer to stream and finalize
    uploadStream.end(buffer);
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary
};
