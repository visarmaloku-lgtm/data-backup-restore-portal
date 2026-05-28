let sql = null;
try {
  sql = require("mssql");
} catch (e) {
  console.warn("mssql not available, running in demo mode");
}
require("dotenv").config();

const sqlConfig = {
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let poolInstance = null;

async function getPool() {
  if (!sql) throw new Error("mssql not available");
  if (!poolInstance) {
    poolInstance = new sql.ConnectionPool(sqlConfig);
    await poolInstance.connect();
    console.log("Connected to SQL Server");
  }
  return poolInstance;
}

module.exports = { sql, getPool, config: sqlConfig };
