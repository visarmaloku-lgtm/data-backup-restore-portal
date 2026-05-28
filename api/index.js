const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

process.env.DEMO_MODE = "true";
process.env.BACKUP_TEMP_DIR = "/tmp";

app.use("/api", require("../backend/routes/backup"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", demo: true, timestamp: new Date().toISOString() });
});

const frontendBuild = path.join(__dirname, "..", "frontend", "build");
app.use(express.static(frontendBuild));
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(frontendBuild, "index.html"));
  }
});

module.exports = app;
