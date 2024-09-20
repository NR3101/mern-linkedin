import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

// User Controllers

// Get suggested connections for the current user
export const getSuggestedConnections = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select("connections");

    // Get all users except ourselves and those we are already connected with
    const suggestedUsers = await User.find({
      _id: { $ne: req.user._id, $nin: currentUser.connections },
    })
      .select("name username profilePicture headline")
      .limit(4);

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error("Error in getSuggestedConnections controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get public profile of a user by username
export const getPublicProfile = async (req, res) => {
  try {
    // Find user by username and exclude password field
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );

    // If user not found return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getPublicProfile controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const allowedField = [
      "name",
      "username",
      "headline",
      "about",
      "location",
      "profilePicture",
      "bannerImg",
      "skills",
      "experience",
      "education",
    ];

    const updatedData = {};

    // Loop through allowed fields and update if present in request body
    for (const field of allowedField) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }

    // Update images in cloudinary if present in request body
    if (req.body.profilePicture) {
      const result = await cloudinary.uploader.upload(req.body.profilePicture);
      updatedData.profilePicture = result.secure_url;
    }

    if (req.body.bannerImg) {
      const result = await cloudinary.uploader.upload(req.body.bannerImg);
      updatedData.bannerImg = result.secure_url;
    }

    // Find user by id and update the data and return the updated user(with new=true)
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: updatedData,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in updateProfile controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
