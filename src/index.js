require("dotenv").config();
const app = require("./app");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

// cors setup for app
// app.use(cors({ origin: 'https://yourfrontend.com' }));
// const corsOptions = {
//   origin: "http://localhost:5173", // Your frontend URL
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };

// // Apply CORS globally
// app.use(cors(corsOptions)); // 👈 This handles ALL routes (including OPTIONS)

// app.use(cors());

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "DELETE", "PUT"],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "Cache-Control",
//       "Expires",
//       "Pragma",
//     ],
//     credentials: true,
//   })
// );

// see output in console
app.use(morgan("dev")); // Concise output for development

// Sets various HTTP headers for security
const helmet = require("helmet");
app.use(helmet()); // One line adds 11 security middlewares

// mongo db connection
databaseConnect = () => {
  mongoose
    .connect(process.env.mongoURI)
    .then(() => {
      console.log("MongoDB connected successfull!!");
    })
    .catch((e) => {
      console.log(`Error while connection mongoDB : ${e}`);
    });
};

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
  databaseConnect();
});
