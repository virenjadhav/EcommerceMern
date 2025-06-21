require("dotenv").config({ path: path.resolve(__dirname, "../.env.test") });
// const app = require("./app");
const app = require("./app.test");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

// cors setup for app
// app.use(cors({ origin: 'https://yourfrontend.com' }));

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
