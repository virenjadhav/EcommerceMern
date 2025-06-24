const express = require("express");
const AuthRouter = require("./routes/AuthRouter");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user/UserRoute");
const adminRouter = require("./routes/admin/adminRoute");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.test") });

const app = express();

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
app.use("/api/v1/user", userRouter);

// admin routes
app.use("/api/v1/admin", adminRouter);

module.exports = app;
