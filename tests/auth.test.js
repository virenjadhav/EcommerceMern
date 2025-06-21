const mongoose = require("mongoose");
const path = require("path");
const axiosService = require("./axiosService");
// const axios = require("axios");

// Load test environment variables
require("dotenv").config({ path: path.resolve(__dirname, "../.env.test") });
// const BASE_URL = process.env.BACKEND_URL || "http://localhost:5000";
// const database_name = "users_test";

// Connect to MongoDB
beforeAll(async () => {
  try {
    console.log("Env for test", process.env.TEST_DB_URI);
    await mongoose.connect(process.env.TEST_DB_URI);
    console.log("MongoDB connected successfully!");

    // Create users_test collection if it doesn't exist
    const collections = mongoose.connection.collections;
    if (!collections.users_test) {
      await mongoose.connection.createCollection("users_test");
      console.log("Created users_test collection!");
    }
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
});

// Close connection
afterAll(async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
});

// Clean up database after each test
afterEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    if (collections.users_test) {
      await collections.users_test.deleteMany({});
    }
  } catch (error) {
    console.error("Error cleaning up test data:", error);
  }
});

describe("Test server", () => {
  test("/", async () => {
    const res = await axiosService.get("/");
    expect(res.status).toBe(200);
  });
});

// describe("Auth API Tests", () => {
//   test("POST /auth/signup - should create a new user", async () => {
//     const testUser = {
//       email: "test@example.com",
//       password: "123456",
//     };
//     try {
//       // 1. Make the signup request
//       const response = await axios.post(`${BASE_URL}/auth/signup`, testUser);
//       // 2. Verify the response
//       expect(response.status).toBe(201);
//       expect(response.data).toHaveProperty(
//         "message",
//         "User created successfully"
//       );
//       expect(response.data).toHaveProperty("user");
//       expect(response.data.user.email).toBe(testUser.email);
//       expect(response.data.user).not.toHaveProperty("password"); // Password shouldn't be in response
//       // 3. Verify the user was actually created in the database
//       const dbUser = await mongoose.connection.db
//         .collection("users_test")
//         .findOne({
//           email: testUser.email,
//         });
//       expect(dbUser).toBeTruthy();
//       expect(dbUser.email).toBe(testUser.email);
//       expect(dbUser.password).not.toBe(testUser.password); // Password should be hashed
//       expect(dbUser).toHaveProperty("createdAt");
//       expect(dbUser).toHaveProperty("updatedAt");
//     } catch (error) {
//       if (error.response) {
//         // If axios got a response with error status code
//         console.error("Error response data:", error.response.data);
//         console.error("Error status code:", error.response.status);
//       } else {
//         // Other errors (network, etc.)
//         console.error("Error:", error.message);
//       }
//       throw error;
//     }
//   });
//   test("POST /auth/signup - should fail with invalid data", async () => {
//     const invalidUser = {
//       email: "not-an-email",
//       password: "123", // Too short
//     };
//     try {
//       await axios.post(`${BASE_URL}/auth/signup`, invalidUser);
//       // If we get here, the test should fail because we expected an error
//       throw new Error("Request should have failed but didn't");
//     } catch (error) {
//       expect(error.response.status).toBe(400);
//       expect(error.response.data).toHaveProperty("errors");
//       expect(error.response.data.errors).toBeInstanceOf(Array);
//     }
//   });
//   test("POST /auth/signup - should fail with duplicate email", async () => {
//     const testUser = {
//       email: "duplicate@example.com",
//       password: "123456",
//     };
//     // First create the user
//     await axios.post(`${BASE_URL}/auth/signup`, testUser);
//     try {
//       // Try to create again
//       await axios.post(`${BASE_URL}/auth/signup`, testUser);
//       throw new Error("Request should have failed but didn't");
//     } catch (error) {
//       expect(error.response.status).toBe(409);
//       expect(error.response.data).toHaveProperty(
//         "message",
//         "Email already exists"
//       );
//     }
//   });
// });

describe("Auth API Test", () => {
  // sigunp api
  test("Signup API test", async () => {
    const res = await axiosService.post("/api/v1/auth/signup", {
      username: "TestUserSignup",
      email: "signupuser@test.com",
      password: "Signup123",
    });
    console.log("res", res);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });
  // login api
  // logout api
});
