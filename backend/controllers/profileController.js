const User = require('../models/user_model');
const { uploadToCloudinary } = require('../config/cloudinary');

/**
 * GET /profile
 * Fetch authenticated user profile data
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getProfile controller:", error);
    res.status(500).json({ message: "Server error while fetching profile", error: error.message });
  }
};

/**
 * PUT /profile/update
 * Update authenticated user profile details
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name,
      collegeOrCompany,
      skills,
      bio,
      github,
      linkedin,
      portfolio,
      mobile,
      location
    } = req.body;

    // Validate name
    if (name !== undefined && name.trim() === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    // Process skills to format it as an array of trimmed strings
    let processedSkills = [];
    if (Array.isArray(skills)) {
      processedSkills = skills.map(skill => String(skill).trim()).filter(Boolean);
    } else if (typeof skills === 'string') {
      processedSkills = skills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean);
    } else {
      processedSkills = [];
    }

    const updateFields = {
      name,
      collegeOrCompany,
      skills: processedSkills,
      bio,
      github,
      linkedin,
      portfolio,
      mobile,
      location
    };

    // Update fields in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully!",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    res.status(500).json({ message: "Server error while updating profile", error: error.message });
  }
};

/**
 * POST /profile/upload-image
 * Upload profile photo to Cloudinary and update user profilePicture field
 */
const uploadImage = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: "No file provided for upload" });
    }

    // Upload to Cloudinary using buffer helper
    const uploadResult = await uploadToCloudinary(req.file.buffer);

    // Save secure url to profilePicture field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { profilePicture: uploadResult.secure_url } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile picture uploaded successfully!",
      profilePicture: uploadResult.secure_url,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error in uploadImage controller:", error);
    res.status(500).json({ message: "Server error while uploading image", error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadImage
};
