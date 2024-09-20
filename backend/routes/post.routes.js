import express from "express";
import { protectRoute } from "../middlewares/auth.middlewares.js";
import {
  getFeedPosts,
  createPost,
  deletePost,
  getPostById,
  createComment,
  likePost,
} from "../controllers/post.controller.js";

const router = express.Router();

// Routes for post with controllers
router.get("/", protectRoute, getFeedPosts); // Get all posts in the user's feed
router.post("/create", protectRoute, createPost); // Create a new post
router.delete("/delete/:id", protectRoute, deletePost); // Delete a post
router.get("/:id", protectRoute, getPostById); // Get a post by ID
router.post("/:id/comment", protectRoute, createComment); // Create a comment on a post
router.post("/:id/like", protectRoute, likePost); // Like a post

export default router;
