const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");

function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", (_req, res) => {
    res.json({
      message: "This is a demo endpoint",
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}

module.exports = serverless(createServer());
