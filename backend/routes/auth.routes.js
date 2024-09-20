import express from "express";
import {
  login,
  logout,
  signup,
  getCurrentUser,
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// auth routes with controllers
router.post("/signup", signup); //signup route
router.post("/login", login); //login route
router.post("/logout", logout); //logout route

router.get("/me", protectRoute, getCurrentUser); //get current user route

export default router;
