import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import connectionRoutes from "./routes/connection.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

// middlewares to handle cors,json data and cookies
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

app.use(
  express.json({
    // to parse json data
    limit: "5mb",
  })
);
app.use(cookieParser()); // to read cookies

// routes
app.use("/api/v1/auth", authRoutes); // auth routes
app.use("/api/v1/users", userRoutes); // user routes
app.use("/api/v1/posts", postRoutes); // post routes
app.use("/api/v1/notifications", notificationRoutes); // notification routes
app.use("/api/v1/connections", connectionRoutes); // connection routes

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
