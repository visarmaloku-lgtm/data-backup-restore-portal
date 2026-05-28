const { sql, getPool } = require("../config/db");

class BackupModel {
  static async initTable() {
    const pool = await getPool();
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='backup_history' AND xtype='U')
      CREATE TABLE backup_history (
        id INT IDENTITY(1,1) PRIMARY KEY,
        file_name NVARCHAR(500) NOT NULL,
        database_name NVARCHAR(200) NOT NULL,
        file_size_mb DECIMAL(10,2),
        cloud_url NVARCHAR(1000),
        sas_url NVARCHAR(1000),
        status NVARCHAR(50) DEFAULT 'Pending',
        error_message NVARCHAR(MAX),
        created_at DATETIME DEFAULT GETDATE()
      )
    `);
  }

  static async getAll() {
    const pool = await getPool();
    const result = await pool
      .request()
      .query("SELECT * FROM backup_history ORDER BY created_at DESC");
    return result.recordset;
  }

  static async getById(id) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM backup_history WHERE id = @id");
    return result.recordset[0];
  }

  static async create({ file_name, database_name, file_size_mb, cloud_url, sas_url, status, error_message }) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("file_name", sql.NVarChar(500), file_name)
      .input("database_name", sql.NVarChar(200), database_name)
      .input("file_size_mb", sql.Decimal(10, 2), file_size_mb || 0)
      .input("cloud_url", sql.NVarChar(1000), cloud_url || null)
      .input("sas_url", sql.NVarChar(1000), sas_url || null)
      .input("status", sql.NVarChar(50), status || "Success")
      .input("error_message", sql.NVarChar(sql.MAX), error_message || null)
      .query(`
        INSERT INTO backup_history (file_name, database_name, file_size_mb, cloud_url, sas_url, status, error_message)
        OUTPUT INSERTED.*
        VALUES (@file_name, @database_name, @file_size_mb, @cloud_url, @sas_url, @status, @error_message)
      `);
    return result.recordset[0];
  }

  static async updateStatus(id, { status, sas_url, error_message }) {
    const pool = await getPool();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("status", sql.NVarChar(50), status)
      .input("sas_url", sql.NVarChar(1000), sas_url || null)
      .input("error_message", sql.NVarChar(sql.MAX), error_message || null)
      .query(`
        UPDATE backup_history
        SET status = @status,
            sas_url = COALESCE(@sas_url, sas_url),
            error_message = @error_message
        WHERE id = @id
      `);
  }
}

module.exports = BackupModel;
