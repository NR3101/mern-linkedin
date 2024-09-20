import express from "express";
import { protectRoute } from "../middlewares/auth.middlewares.js";
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../controllers/notification.controllers.js";

const router = express.Router();

// Notification routes with controllers
router.get("/", protectRoute, getUserNotifications); // get all notifications for a user
router.put("/:id/read", protectRoute, markNotificationAsRead); // mark a notification as read
router.delete("/:id", protectRoute, deleteNotification); // delete a notification

export default router;
