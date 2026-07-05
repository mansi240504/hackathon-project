const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyToken = require('../middleware/verifyToken');
const { getProfile, updateProfile, uploadImage } = require('../controllers/profileController');

// Configure Multer to store uploaded files in memory
const storage = multer.memoryStorage();

// Set limits and file types for upload security
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit files to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Filter: accept only image file formats
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type! Only image uploads are allowed.'), false);
    }
  }
});

// GET /profile - Get authenticated user profile details
router.get('/', verifyToken, getProfile);

// PUT /profile/update - Update user profile details
router.put('/update', verifyToken, updateProfile);

// POST /profile/upload-image - Upload user profile photo to Cloudinary
router.post('/upload-image', verifyToken, upload.single('image'), uploadImage);

// Multer error handling middleware for validation and size limits
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

module.exports = router;
