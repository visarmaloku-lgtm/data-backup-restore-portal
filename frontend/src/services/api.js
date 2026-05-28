import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

export const createBackup = (database_name) =>
  API.post("/backup", { database_name });

export const listBackups = () =>
  API.get("/backups");

export const getBackup = (id) =>
  API.get(`/backup/${id}`);

export const downloadBackup = (id) =>
  API.get(`/backup/${id}/download`);

export const restoreBackup = (id) =>
  API.post(`/backup/${id}/restore`);

export const deleteBackup = (id) =>
  API.delete(`/backup/${id}`);
