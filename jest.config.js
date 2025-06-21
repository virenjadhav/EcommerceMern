// module.exports = {
//   testEnvironment: "node", // For backend testing
//   testMatch: ["**/tests/**/*.test.js"], // Finds all test files
//   setupFilesAfterEnv: ["./tests/setup.js"], // Global test setup
//   collectCoverage: true, // Generates coverage report
//   coverageDirectory: "coverage",
// };
module.exports = {
  testEnvironment: "node",
  setupFiles: ["dotenv/config"], // Loads .env.test
  testMatch: ["**/tests/**/*.test.js"],
};
