require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { initAzure } = require("./config/azure");
const BackupModel = require("./models/backupModel");

const app = express();
const PORT = process.env.PORT || 5000;
const DEMO_MODE = process.env.DEMO_MODE === "true";

app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/backup"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", demo: DEMO_MODE, timestamp: new Date().toISOString() });
});

const frontendBuild = path.join(__dirname, "..", "frontend", "build");
app.use(express.static(frontendBuild));
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(frontendBuild, "index.html"));
  }
});

async function start() {
  if (!DEMO_MODE) {
    for (let i = 0; i < 5; i++) {
      try {
        await BackupModel.initTable();
        console.log("Database tables initialized");
        break;
      } catch (err) {
        console.warn(`DB init attempt ${i + 1}/5 failed: ${err.message}`);
        if (i < 4) await new Promise((r) => setTimeout(r, 3000));
      }
    }
  } else {
    console.log("Demo mode enabled — SQL Server not required");
  }
  initAzure();
  app.listen(PORT, () => {
    console.log(`Backup Portal API running on http://localhost:${PORT}${DEMO_MODE ? " (DEMO MODE)" : ""}`);
  });
}

start();
