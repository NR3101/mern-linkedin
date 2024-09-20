import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { sendConnectionAcceptedEmail } from "../emails/emailHandlers.js";

// Connection request controller

// Send a connection request to a user
export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.user._id;

    // Check if the user is trying to send a connection request to themselves
    if (senderId.toString() === userId) {
      return res
        .status(400)
        .json({ message: "You cannot send a connection request to yourself" });
    }

    // Check if the connection request already exists
    const existingRequest = await ConnectionRequest.findOne({
      sender: senderId,
      recipient: userId,
      status: "pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already sent" });
    }

    // Create a new connection request
    const newRequest = new ConnectionRequest({
      sender: senderId,
      recipient: userId,
    });

    await newRequest.save();

    res.status(201).json({ message: "Connection request sent successfully" });
  } catch (error) {
    console.error("Error in sendConnectionRequest: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Accept a connection request
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    // Find the connection request and populate the sender and recipient fields
    const request = await ConnectionRequest.findById(requestId)
      .populate("sender", "name username email") // Populate the sender field
      .populate("recipient", "name username"); // Populate the recipient field

    // Check if the connection request exists
    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // Check if the request recipient is the current user
    if (request.recipient._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to accept this request" });
    }

    // Check if the request is already accepted or rejected
    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Connection request already processed" });
    }

    // Update the request status to "accepted"
    request.status = "accepted";
    await request.save();

    // Update the connections for the sender and recipient
    await User.findByIdAndUpdate(request.sender._id, {
      $addToSet: { connections: userId },
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: request.sender._id },
    });

    // Create a notification for the sender
    const notification = new Notification({
      recipient: request.sender._id,
      type: "connectionAccepted",
      relatedUser: userId,
    });

    await notification.save();

    res.status(200).json({ message: "Connection request accepted" });

    // Send a email notification to the sender
    const senderEmail = request.sender.email;
    const senderName = request.sender.name;
    const recipientName = request.recipient.name;
    const profileUrl = `${process.env.CLIENT_URL}/profile/${recipientName}`;

    try {
      await sendConnectionAcceptedEmail(
        senderEmail,
        senderName,
        recipientName,
        profileUrl
      );
    } catch (error) {
      console.error("Error sending connection accepted email: ", error);
    }
  } catch (error) {
    console.error("Error in acceptConnectionRequest: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reject a connection request
export const rejectConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    // Find the connection request
    const request = await ConnectionRequest.findById(requestId);

    // Check if the connection request exists
    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // Check if the request recipient is the current user
    if (request.recipient._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to reject this request" });
    }

    // Check if the request is already accepted or rejected
    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Connection request already processed" });
    }

    // Update the request status to "rejected"
    request.status = "rejected";
    await request.save();

    res.status(200).json({ message: "Connection request rejected" });
  } catch (error) {
    console.error("Error in rejectConnectionRequest: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all connection requests for a user
export const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all connection requests for the user
    const requests = await ConnectionRequest.find({
      recipient: userId,
      status: "pending",
    })
      .populate("sender", "name username profilePicture headline connections") // Populate the sender field
      .sort({ createdAt: -1 }); // Sort the requests by creation date

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error in getConnectionRequests: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all connections for a user
export const getUserConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user and populate the connections field
    const user = await User.findById(userId).populate(
      "connections",
      "name username profilePicture headline connections"
    );

    res.status(200).json(user.connections);
  } catch (error) {
    console.error("Error in getUserConnections: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove a connection
export const removeConnection = async (req, res) => {
  try {
    const myId = req.user._id;
    const { userId } = req.params;

    // remove connection from both users
    await User.findByIdAndUpdate(myId, { $pull: { connections: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { connections: myId } });

    res.status(200).json({ message: "Connection removed successfully" });
  } catch (error) {
    console.error("Error in removeConnection: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get connection status with a user["pending", "accepted", "rejected"]
export const getConnectionStatus = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    // Check if the users are already connected set the status to "connected"
    const currentUser = req.user;
    if (currentUser.connections.includes(targetUserId)) {
      return res.status(200).json({ status: "connected" });
    }

    // Find the pending connection request between the users from either side
    const pendingRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: currentUserId, recipient: targetUserId },
        { sender: targetUserId, recipient: currentUserId },
      ],
      status: "pending",
    });

    // if the request exists, check if the current user is the sender or recipient
    if (pendingRequest) {
      // if the current user is the sender, the status is "pending"
      if (pendingRequest.sender.toString() === currentUserId.toString()) {
        return res.status(200).json({ status: "pending" });
      }
      // if the current user is the recipient, the status is "received"
      else {
        return res
          .status(200)
          .json({ status: "received", requestId: pendingRequest._id });
      }
    }

    // if there is no connected or pending request, the status is "not connected"
    res.status(200).json({ status: "not_connected" });
  } catch (error) {
    console.error("Error in getConnectionStatus: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
