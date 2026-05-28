import React, { useState, useEffect, useCallback } from "react";
import { listBackups, downloadBackup, restoreBackup, deleteBackup } from "../services/api";
import axios from "axios";
import BackupItem from "./BackupItem";

export default function BackupList({ refreshTrigger }) {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBackups = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listBackups();
      setBackups(res.data.backups);
    } catch (err) {
      console.error("Failed to fetch backups", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/demo").catch(() => {});
    fetchBackups();
  }, [fetchBackups, refreshTrigger]);

  const handleDownload = async (backup) => {
    try {
      const res = await downloadBackup(backup.id);
      if (res.data.success && res.data.downloadUrl) {
        window.open(res.data.downloadUrl, "_blank");
      }
    } catch (err) {
      alert("Download failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleRestore = async (backup) => {
    if (!window.confirm(`Restore "${backup.file_name}" to test database?`)) return;
    try {
      const res = await restoreBackup(backup.id);
      alert(res.data.message);
    } catch (err) {
      alert("Restore failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (backup) => {
    if (!window.confirm(`Delete "${backup.file_name}" from Cloud?`)) return;
    try {
      await deleteBackup(backup.id);
      fetchBackups();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return <div className="loading">Loading backups...</div>;
  }

  return (
    <div className="backup-list">
      <h2>Backup History</h2>
      {backups.length === 0 ? (
        <p className="empty-state">No backups yet. Click "Create Backup" to get started.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Database</th>
              <th>Size</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {backups.map((b) => (
              <BackupItem
                key={b.id}
                backup={b}
                onDownload={handleDownload}
                onRestore={handleRestore}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
