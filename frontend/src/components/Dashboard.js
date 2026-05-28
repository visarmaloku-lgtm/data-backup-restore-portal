import React, { useState } from "react";
import { createBackup } from "../services/api";

export default function Dashboard({ onBackupCreated }) {
  const [loading, setLoading] = useState(false);
  const [dbName, setDbName] = useState("");

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      const res = await createBackup(dbName || undefined);
      if (res.data.success) {
        alert("Backup saved to Cloud successfully!");
        if (onBackupCreated) onBackupCreated();
      }
    } catch (err) {
      alert("Backup failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h2>Create New Backup</h2>
        <p>Generate a full database backup and upload it to Azure Cloud Storage.</p>
        <div className="backup-form">
          <input
            type="text"
            placeholder="Database name (leave empty for default)"
            value={dbName}
            onChange={(e) => setDbName(e.target.value)}
            className="input"
          />
          <button
            className="btn btn-primary"
            onClick={handleCreateBackup}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              "Create Backup"
            )}
          </button>
        </div>
      </div>

      <div className="dashboard-info">
        <div className="info-item">
          <span className="info-icon">&#8673;</span>
          <div>
            <strong>Manual & Automatic</strong>
            <small>Trigger backups on demand</small>
          </div>
        </div>
        <div className="info-item">
          <span className="info-icon">&#9729;</span>
          <div>
            <strong>Azure Cloud Sync</strong>
            <small>Automatic upload to Blob Storage</small>
          </div>
        </div>
        <div className="info-item">
          <span className="info-icon">&#8635;</span>
          <div>
            <strong>Restore Simulation</strong>
            <small>Test restore to verification DB</small>
          </div>
        </div>
      </div>
    </div>
  );
}
