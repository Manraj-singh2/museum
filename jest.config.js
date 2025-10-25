// jest.config.js
const path = require("path");
const envFile = path.join(__dirname, "env.jest");
require("dotenv").config({ path: envFile });

module.exports = {
  verbose: true,
  testEnvironment: "jsdom",
  setupFiles: ["jest-fetch-mock"],
  testTimeout: 5000,
};
