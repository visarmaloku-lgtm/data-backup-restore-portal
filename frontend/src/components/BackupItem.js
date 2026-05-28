import React from "react";

export default function BackupItem({ backup, onRestore, onDownload, onDelete }) {
  const isSuccess = backup.status === "Success";
  const isFailed = backup.status === "Failed";

  return (
    <tr className={`backup-row ${isSuccess ? "row-success" : ""} ${isFailed ? "row-failed" : ""}`}>
      <td title={backup.file_name}>{backup.file_name}</td>
      <td>{backup.database_name}</td>
      <td>{backup.file_size_mb ? `${backup.file_size_mb} MB` : "-"}</td>
      <td>
        <span className={`status-badge ${isSuccess ? "status-success" : ""} ${isFailed ? "status-failed" : ""} ${!isSuccess && !isFailed ? "status-pending" : ""}`}>
          {backup.status}
        </span>
      </td>
      <td>{new Date(backup.created_at).toLocaleString()}</td>
      <td className="actions">
        <button className="btn btn-sm btn-success" onClick={() => onDownload(backup)} title="Download from Cloud">
          Download
        </button>
        <button className="btn btn-sm btn-warning" onClick={() => onRestore(backup)} title="Restore to test database">
          Restore
        </button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(backup)} title="Delete from Cloud">
          Delete
        </button>
      </td>
    </tr>
  );
}
