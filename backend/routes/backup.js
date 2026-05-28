const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/backupController");

router.get("/demo", ctrl.getDemo);
router.post("/backup", ctrl.createBackup);
router.get("/backups", ctrl.listBackups);
router.get("/backup/:id", ctrl.getBackup);
router.get("/backup/:id/download", ctrl.downloadBackup);
router.post("/backup/:id/restore", ctrl.restoreBackup);
router.delete("/backup/:id", ctrl.deleteBackup);

module.exports = router;
