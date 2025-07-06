const express = require("express");
const bodyParser = require('body-parser');
const AuthRouter = require("./routes/AuthRouter");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user/UserRoute");
const adminRouter = require("./routes/admin/adminRoute");
const authMiddleware = require("./middlewares/AuthMiddleware");
const adminMiddleware = require("./middlewares/AdminMiddleware");
const userMiddleware = require("./middlewares/UserMiddleware");

const cors = require("cors");
const commonFeatureRouter = require("./routes/CommonFeatureRouter");
const searchRouter = require("./routes/user/SearchRoute");
const { stripeWebhook } = require("./controllers/user/OrderController");

const app = express();

// ✅ Register webhook BEFORE body parsing middleware
app.post("/api/v1/webhook", express.raw({ type: 'application/json' }), stripeWebhook);


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
app.use(bodyParser.json());

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

app.use("/api/v1/common/feature", commonFeatureRouter);
app.use("/api/v1/shop/search", searchRouter);



module.exports = app;
