import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Protect routes middleware
export const protectRoute = async (req, res, next) => {
  try {
    // Get token from the cookies
    const token = req.cookies["jwt-linkedin"];

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Get user details from the database and exclude password
    const user = await User.findById(decoded.userId).select("-password");

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user details to the request object
    req.user = user;

    next(); // Move to the next middleware
  } catch (error) {
    console.error("Error in protectRoute middleware: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
