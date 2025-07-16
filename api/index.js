const serverless = require("serverless-http");
const { createServer } = require("../server");

module.exports = serverless(createServer());
