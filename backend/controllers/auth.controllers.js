import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { generateToken } from "../utils/generateToken.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

dotenv.config();

// Auth controllers

// Signup controller
export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Validate user input
    if (!email || !password || !name || !username) {
      return res.status(400).json({ message: "All inputs are required" });
    }

    // Check if username already exist in the database and throw error
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if email already exist in the database and throw error
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await user.save();

    // Generate token and send it in a cookie
    generateToken(res, user._id);

    // Send user details as response
    res.status(201).json({
      message: "User created successfully",
      _id: user._id,
    });

    // Profile URL
    const profileUrl = `${process.env.CLIENT_URL}/profile/${user.username}`;

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name, profileUrl);
    } catch (error) {
      console.error("Error sending welcome email: ", error);
    }
  } catch (error) {
    console.error("Error in signup controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate user input
    if (!username || !password) {
      return res.status(400).json({ message: "All inputs are required" });
    }

    // Find user in the database
    const user = await User.findOne({ username });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    // Check if password is correct
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate token and send it in a cookie
    generateToken(res, user._id);

    // Send user details as response
    res.status(200).json({
      message: "Logged in successfully",
      _id: user._id,
    });
  } catch (error) {
    console.error("Error in login controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout controller
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt-linkedin");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get current user controller
export const getCurrentUser = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in getCurrentUser controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
