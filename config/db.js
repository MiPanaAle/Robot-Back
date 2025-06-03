import mssql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    requestTimeout: 30000,
    connectionTimeout: 30000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Crear pool de conexiones
let pool;
try {
  pool = new mssql.ConnectionPool(config);
  pool.connect();
  console.log('✅ Conexión a SQL Server establecida correctamente');
} catch (error) {
  console.error('❌ Error conectando a SQL Server:', error);
}

export { mssql as sql, pool };