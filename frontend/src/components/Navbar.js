import React from "react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">&#9729;</span>
        <h1>Data Backup & Restore Portal</h1>
      </div>
      <p className="navbar-subtitle">Cloud-Managed SQL Server Backups via Azure</p>
    </nav>
  );
}
