const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const demoStore = [];
let nextId = 1;

app.post("/api/backup", (req, res) => {
  const dbName = req.body.database_name || "DemoDB";
  const now = new Date();
  const backup = {
    id: nextId++, file_name: `${dbName}_${now.toISOString().replace(/[:.]/g, "-")}.bak`,
    database_name: dbName, file_size_mb: (Math.random() * 300 + 10).toFixed(2),
    status: "Success", created_at: now.toISOString(),
    cloud_url: "https://demoblob.blob.core.windows.net/backups/demo.bak",
    sas_url: "https://demoblob.blob.core.windows.net/backups/demo.bak?se=2026-12-31&sp=r&sig=demo"
  };
  demoStore.unshift(backup);
  res.json({ success: true, message: "Backup saved to Cloud (demo)", backup, demo: true });
});

app.get("/api/backups", (req, res) => {
  res.json({ success: true, backups: demoStore, demo: true });
});

app.get("/api/backup/:id", (req, res) => {
  const backup = demoStore.find(b => b.id === parseInt(req.params.id));
  if (!backup) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, backup });
});

app.get("/api/backup/:id/download", (req, res) => {
  const backup = demoStore.find(b => b.id === parseInt(req.params.id));
  if (!backup) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, downloadUrl: backup.sas_url, demo: true });
});

app.post("/api/backup/:id/restore", (req, res) => {
  const backup = demoStore.find(b => b.id === parseInt(req.params.id));
  if (!backup) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, message: "Database restored successfully (demo)", demo: true });
});

app.delete("/api/backup/:id", (req, res) => {
  const idx = demoStore.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: "Not found" });
  demoStore.splice(idx, 1);
  res.json({ success: true, message: "Backup deleted (demo)", demo: true });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", demo: true, timestamp: new Date().toISOString() });
});

module.exports = app;
