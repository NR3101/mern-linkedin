import express from "express";
import { protectRoute } from "../middlewares/auth.middlewares.js";
import {
  getSuggestedConnections,
  getPublicProfile,
  updateProfile,
} from "../controllers/user.controllers.js";

const router = express.Router();

// user routes with controllers
router.get("/suggestions", protectRoute, getSuggestedConnections); //get suggested connections route
router.get("/:username", protectRoute, getPublicProfile); //get user public profile route

router.put("/profile", protectRoute, updateProfile); //update user profile route

export default router;
