const express = require("express");
const AuthRouter = require("./routes/AuthRouter");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user/UserRoute");
const adminRouter = require("./routes/admin/adminRoute");
const authMiddleware = require("./middlewares/AuthMiddleware");
const adminMiddleware = require("./middlewares/AdminMiddleware");
const userMiddleware = require("./middlewares/UserMiddleware");

const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
    exposedHeaders: ["Set-Cookie", "Date", "ETag"],
  })
);

// use json middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is working",
  });
});

// auth router
app.use("/api/v1/auth", AuthRouter);

// user routes
app.use("/api/v1/shop", authMiddleware, userMiddleware, userRouter);

// admin routes
app.use("/api/v1/admin", authMiddleware, adminMiddleware, adminRouter);

module.exports = app;
