import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import BackupList from "./components/BackupList";
import "./styles/App.css";

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBackupCreated = () => {
    setRefreshTrigger((t) => t + 1);
  };

  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Dashboard onBackupCreated={handleBackupCreated} />
        <BackupList refreshTrigger={refreshTrigger} />
      </main>
    </div>
  );
}
