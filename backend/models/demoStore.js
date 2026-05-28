const fs = require("fs");
const path = require("path");

const STORE_FILE = path.resolve("./demo-data.json");

function readStore() {
  if (!fs.existsSync(STORE_FILE)) {
    const initial = { backups: [], nextId: 1 };
    writeStore(initial);
    return initial;
  }
  return JSON.parse(fs.readFileSync(STORE_FILE, "utf-8"));
}

function writeStore(data) {
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));
}

exports.getAll = function () {
  const store = readStore();
  return store.backups;
};

exports.getById = function (id) {
  const store = readStore();
  return store.backups.find((b) => b.id === id) || null;
};

exports.create = function (data) {
  const store = readStore();
  const record = { id: store.nextId++, ...data, created_at: new Date().toISOString() };
  store.backups.unshift(record);
  writeStore(store);
  return record;
};

exports.updateStatus = function (id, updates) {
  const store = readStore();
  const idx = store.backups.findIndex((b) => b.id === id);
  if (idx !== -1) {
    store.backups[idx] = { ...store.backups[idx], ...updates };
    writeStore(store);
  }
};

exports.deleteById = function (id) {
  const store = readStore();
  store.backups = store.backups.filter((b) => b.id !== id);
  writeStore(store);
};

exports.seedDemoData = function () {
  const store = readStore();
  if (store.backups.length === 0) {
    const demos = [
      { id: store.nextId++, file_name: "MyCompanyDB_2026-05-15_00-01-01.bak", database_name: "MyCompanyDB", file_size_mb: 256.42, cloud_url: "https://demoblob.blob.core.windows.net/backups/demo1.bak", sas_url: "https://demoblob.blob.core.windows.net/backups/demo1.bak?se=2026-05-15&sp=r", status: "Success", created_at: "2026-05-15T10:00:00.000Z" },
      { id: store.nextId++, file_name: "MyCompanyDB_2026-05-14_12-30-45.bak", database_name: "MyCompanyDB", file_size_mb: 250.18, cloud_url: "https://demoblob.blob.core.windows.net/backups/demo2.bak", sas_url: "", status: "Success", created_at: "2026-05-14T12:30:45.000Z" },
      { id: store.nextId++, file_name: "TestDB_2026-05-13_08-15-22.bak", database_name: "TestDB", file_size_mb: 15.80, cloud_url: "https://demoblob.blob.core.windows.net/backups/demo3.bak", sas_url: "", status: "Success", created_at: "2026-05-13T08:15:22.000Z" },
      { id: store.nextId++, file_name: "MyCompanyDB_2026-05-12_18-00-00.bak", database_name: "MyCompanyDB", file_size_mb: 0, cloud_url: "", sas_url: "", status: "Failed", error_message: "Timeout exceeded during backup operation", created_at: "2026-05-12T18:00:00.000Z" },
    ];
    store.backups = demos;
    store.nextId = demos.length + 1;
    writeStore(store);
  }
};
