import express from "express";
import {
  acceptConnectionRequest,
  getConnectionRequests,
  getConnectionStatus,
  getUserConnections,
  rejectConnectionRequest,
  removeConnection,
  sendConnectionRequest,
} from "../controllers/connection.controllers.js";
import { protectRoute } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/request/:userId", protectRoute, sendConnectionRequest); // send a connection request to a user
router.put("/accept/:requestId", protectRoute, acceptConnectionRequest); // accept a connection request
router.put("/reject/:requestId", protectRoute, rejectConnectionRequest); // reject a connection request
router.get("/requests", protectRoute, getConnectionRequests); // get all connection requests for a user
router.get("/", protectRoute, getUserConnections); // get all connections for a user
router.delete("/:userId", protectRoute, removeConnection); // remove a connection
router.get("/status/:userId", protectRoute, getConnectionStatus); // get connection status with a user["pending", "accepted", "rejected"]

export default router;
