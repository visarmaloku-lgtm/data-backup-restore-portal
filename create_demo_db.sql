CREATE DATABASE [KompaniaDB];
GO
USE [KompaniaDB];
GO
CREATE TABLE backup_history (
  id INT IDENTITY(1,1) PRIMARY KEY,
  file_name NVARCHAR(500),
  database_name NVARCHAR(200),
  file_size_mb DECIMAL(10,2),
  cloud_url NVARCHAR(1000),
  sas_url NVARCHAR(1000),
  status NVARCHAR(50),
  error_message NVARCHAR(MAX),
  created_at DATETIME DEFAULT GETDATE()
);
GO
CREATE TABLE Punonjesit (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Emri NVARCHAR(100),
  Mbiemri NVARCHAR(100),
  Pozita NVARCHAR(100),
  Paga DECIMAL(10,2),
  Departamenti NVARCHAR(100)
);
GO
INSERT INTO Punonjesit VALUES
  ('Arben','Lila','CEO',15000,'Menaxhment'),
  ('Visar','Maliqi','Developer',5000,'IT'),
  ('Donika','Gashi','Designer',4500,'Design'),
  ('Blerim','Krasniqi','Accountant',4200,'Finance'),
  ('Valon','Berisha','Developer',4800,'IT'),
  ('Fiona','Hoxha','HR Manager',5500,'HR');
GO
CREATE TABLE Produkte (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Emri NVARCHAR(100),
  Cmimi DECIMAL(10,2),
  Sasia INT,
  Kategoria NVARCHAR(100)
);
GO
INSERT INTO Produkte VALUES
  ('Laptop Pro',1200.00,25,'Teknologji'),
  ('Mouse Wireless',35.50,100,'Aksesore'),
  ('Monitor 27"',450.00,30,'Teknologji'),
  ('Tastiere',65.00,75,'Aksesore'),
  ('Webcam HD',80.00,40,'Aksesore');
GO
SELECT 'Punonjesit:', COUNT(*) FROM Punonjesit
UNION ALL
SELECT 'Produkte:', COUNT(*) FROM Produkte;
GO
