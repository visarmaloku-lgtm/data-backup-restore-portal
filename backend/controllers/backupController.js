const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { sql, getPool, config } = require("../config/db");
const BackupModel = require("../models/backupModel");
const DemoStore = require("../models/demoStore");
const { uploadToAzure, downloadFromAzure, generateSasToken, deleteFromAzure } = require("../config/azure");

const BACKUP_DIR = path.resolve(process.env.BACKUP_TEMP_DIR || "./temp");
const SQL_BACKUP_DIR = "C:\\SQLBackups";
const DEMO_MODE = process.env.DEMO_MODE === "true";

function ensureTempDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

function simulateDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.getDemo = async (req, res) => {
  DemoStore.seedDemoData();
  const backups = DemoStore.getAll();
  res.json({ success: true, backups, demo: true });
};

exports.createBackup = async (req, res) => {
  const dbName = req.body.database_name || config.database || "DemoDB";
  const backupId = uuidv4();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${dbName}_${timestamp}_${backupId.slice(0, 8)}.bak`;
  const sqlPath = path.join(SQL_BACKUP_DIR, fileName);
  const localPath = path.join(BACKUP_DIR, fileName);

  let record;
  try {
    if (!fs.existsSync(SQL_BACKUP_DIR)) {
      fs.mkdirSync(SQL_BACKUP_DIR, { recursive: true });
    }
    ensureTempDir();

    if (DEMO_MODE) {
      record = DemoStore.create({ file_name: fileName, database_name: dbName, status: "In Progress" });
    } else {
      record = await BackupModel.create({ file_name: fileName, database_name: dbName, status: "In Progress" });
    }

    if (DEMO_MODE) {
      await simulateDelay(2000);
      const fakeFileSize = (Math.random() * 300 + 10).toFixed(2);
      const cloudUrl = `https://demoblob.blob.core.windows.net/backups/${fileName}`;
      const sasUrl = `${cloudUrl}?se=2026-12-31&sp=r&sig=demo`;
      const updated = DemoStore.create({
        file_name: fileName, database_name: dbName, file_size_mb: parseFloat(fakeFileSize),
        cloud_url: cloudUrl, sas_url: sasUrl, status: "Success",
      });
      return res.json({ success: true, message: "Backup saved to Cloud (demo)", backup: updated, demo: true });
    }

    const pool = await getPool();
    await pool.request().query(`
      BACKUP DATABASE [${dbName}]
      TO DISK = N'${sqlPath}'
      WITH INIT, COMPRESSION, FORMAT, NAME = N'${fileName}'
    `);

    if (fs.existsSync(sqlPath)) {
      fs.copyFileSync(sqlPath, localPath);
      fs.unlinkSync(sqlPath);
    }

    const stats = fs.statSync(localPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    let cloudUrl = null, sasUrl = null;
    const cloudResult = await uploadToAzure(localPath, fileName);
    if (cloudResult.success) {
      cloudUrl = cloudResult.url;
      const sasResult = generateSasToken(fileName);
      sasUrl = sasResult.success ? sasResult.url : null;
      fs.unlinkSync(localPath);
    } else {
      console.warn("Cloud upload skipped:", cloudResult.message);
    }

    const updated = await BackupModel.create({
      file_name: fileName, database_name: dbName, file_size_mb: parseFloat(fileSizeMB),
      cloud_url: cloudUrl, sas_url: sasUrl, status: "Success",
    });

    const msg = cloudUrl ? "Backup saved to Cloud" : "Backup saved locally (Azure not configured)";
    res.json({ success: true, message: msg, backup: updated });
  } catch (err) {
    [sqlPath, localPath].forEach((p) => { try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch (e) {} });
    if (record && record.id) {
      if (DEMO_MODE) {
        DemoStore.updateStatus(record.id, { status: "Failed", error_message: err.message });
      } else {
        await BackupModel.updateStatus(record.id, { status: "Failed", error_message: err.message });
      }
    }
    res.status(500).json({ success: false, message: "Backup failed", error: err.message });
  }
};

exports.listBackups = async (req, res) => {
  try {
    const backups = DEMO_MODE ? DemoStore.getAll() : await BackupModel.getAll();
    res.json({ success: true, backups, demo: DEMO_MODE });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBackup = async (req, res) => {
  try {
    const backup = DEMO_MODE ? DemoStore.getById(parseInt(req.params.id)) : await BackupModel.getById(req.params.id);
    if (!backup) {
      return res.status(404).json({ success: false, message: "Backup not found" });
    }
    res.json({ success: true, backup });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.downloadBackup = async (req, res) => {
  try {
    const backup = DEMO_MODE ? DemoStore.getById(parseInt(req.params.id)) : await BackupModel.getById(req.params.id);
    if (!backup) {
      return res.status(404).json({ success: false, message: "Backup not found" });
    }
    if (DEMO_MODE) {
      const url = backup.sas_url || (backup.cloud_url + "?se=2026-12-31&sp=r&sig=demo");
      return res.json({ success: true, downloadUrl: url, demo: true });
    }
    if (backup.cloud_url && backup.sas_url) {
      return res.json({ success: true, downloadUrl: backup.sas_url });
    }
    if (backup.cloud_url) {
      const sasResult = generateSasToken(backup.file_name);
      if (sasResult.success) {
        await BackupModel.updateStatus(backup.id, { sas_url: sasResult.url });
        return res.json({ success: true, downloadUrl: sasResult.url });
      }
    }
    const localFile = path.join(BACKUP_DIR, backup.file_name);
    if (fs.existsSync(localFile)) {
      return res.download(localFile, backup.file_name);
    }
    res.status(404).json({ success: false, message: "Backup file not found locally or in cloud" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.restoreBackup = async (req, res) => {
  try {
    const backup = DEMO_MODE ? DemoStore.getById(parseInt(req.params.id)) : await BackupModel.getById(req.params.id);
    if (!backup) {
      return res.status(404).json({ success: false, message: "Backup not found" });
    }

    if (DEMO_MODE) {
      await simulateDelay(3000);
      return res.json({ success: true, message: `Database restored successfully to [BackupPortal_RestoreTest] (demo)`, demo: true });
    }

    const testDbName = process.env.DB_TEST_NAME || "BackupPortal_RestoreTest";
    const localPath = path.join(BACKUP_DIR, `restore_${backup.file_name}`);
    ensureTempDir();

    let restoreFile = localPath;
    if (backup.cloud_url) {
      const dlResult = await downloadFromAzure(backup.file_name, localPath);
      if (!dlResult.success) {
        return res.status(500).json({ success: false, message: "Failed to download from cloud" });
      }
    } else {
      const srcPath = path.join(BACKUP_DIR, backup.file_name);
      if (!fs.existsSync(srcPath)) {
        return res.status(404).json({ success: false, message: "Local backup file not found" });
      }
      fs.copyFileSync(srcPath, localPath);
    }

    const pool = await getPool();
    await pool.request().query(`
      IF EXISTS (SELECT name FROM sys.databases WHERE name = N'${testDbName}')
      BEGIN
        ALTER DATABASE [${testDbName}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
        DROP DATABASE [${testDbName}];
      END
    `);

    await pool.request().query(`
      RESTORE DATABASE [${testDbName}]
      FROM DISK = N'${localPath}'
      WITH MOVE N'${backup.database_name}' TO N'${path.join(BACKUP_DIR, `${testDbName}.mdf`)}',
           MOVE N'${backup.database_name}_log' TO N'${path.join(BACKUP_DIR, `${testDbName}_log.ldf`)}',
           REPLACE
    `);
    fs.unlinkSync(localPath);

    res.json({ success: true, message: `Database restored successfully to [${testDbName}]` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Restore failed", error: err.message });
  }
};

exports.deleteBackup = async (req, res) => {
  try {
    const backup = DEMO_MODE ? DemoStore.getById(parseInt(req.params.id)) : await BackupModel.getById(req.params.id);
    if (!backup) {
      return res.status(404).json({ success: false, message: "Backup not found" });
    }

    if (DEMO_MODE) {
      DemoStore.deleteById(parseInt(req.params.id));
      return res.json({ success: true, message: "Backup deleted from cloud and history (demo)", demo: true });
    }

    if (backup.cloud_url) {
      await deleteFromAzure(backup.file_name).catch(() => {});
    }
    const localFile = path.join(BACKUP_DIR, backup.file_name);
    if (fs.existsSync(localFile)) {
      fs.unlinkSync(localFile);
    }
    const pool = await getPool();
    await pool.request().input("id", sql.Int, req.params.id).query("DELETE FROM backup_history WHERE id = @id");
    res.json({ success: true, message: "Backup deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
