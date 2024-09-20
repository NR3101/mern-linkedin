import Notification from "../models/notification.model.js";

// Notification controllers

// get all notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    // find all notifications for the logged in user
    const notifications = await Notification.find({
      recipient: req.user._id,
    })
      .sort({ createdAt: -1 }) // sort by createdAt in descending order
      .populate("relatedUser", "name profilePic username") // populate relatedUser with name, profilePic, and username
      .populate("relatedPost", "content image"); // populate relatedPost with content and image

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error in getUserNotifications: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// mark a notification as read
export const markNotificationAsRead = async (req, res) => {
  const notificationId = req.params.id;

  try {
    // find the notification by id where recipient is the logged in user and update read to true
    const notification = await Notification.findByIdAndUpdate(
      { _id: notificationId, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error in markNotificationAsRead: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// delete a notification
export const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;

  try {
    // find the notification by id where recipient is the logged in user and delete it
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNotification: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
