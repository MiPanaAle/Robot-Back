const sql = require('mssql');
require('dotenv').config();

// Configuración de la conexión a SQL Server
const connection = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Para conexiones Azure
    trustServerCertificate: true, // Cambiar a false en producción
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Creamos un pool de conexiones para reutilizar
const pool = new sql.ConnectionPool(connection);

// Conectamos el pool
const poolConnect = pool.connect();

// Manejamos errores de conexión
poolConnect.catch(err => {
  console.error('Error al conectar a SQL Server:', err);
});

// Exportamos el pool para uso en la aplicación
module.exports = {
  sql,
  pool,
  poolConnect
};