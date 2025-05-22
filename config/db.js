const sql = require("mssql");
require("dotenv").config();

// Configuración de la conexión a SQL Server
const connection = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Para conexiones Azure
    trustServerCertificate: true, // Cambiar a false en producción
    enableArithAbort: true,
    connectTimeout: 60000, // 60 segundos
    requestTimeout: 60000, // 60 segundos
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 5000,
  },
};

// Validar que todas las variables de entorno necesarias estén presentes
const validateConfig = () => {
  const requiredEnvVars = [
    "DB_USER",
    "DB_PASSWORD",
    "DB_SERVER",
    "DB_DATABASE",
  ];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Faltan las siguientes variables de entorno: ${missingVars.join(", ")}`
    );
  }
};

// Validar configuración
try {
  validateConfig();
} catch (error) {
  console.error("Error en la configuración:", error.message);
  process.exit(1);
}

// Creamos un pool de conexiones para reutilizar
const pool = new sql.ConnectionPool(connection);

// Evento cuando el pool se conecta exitosamente
pool.on("connect", () => {
  console.log("Pool de conexiones establecido");
});

// Evento cuando hay un error en el pool
pool.on("error", (err) => {
  console.error("Error en el pool de conexiones:", err);
});

// Conectamos el pool
const poolConnect = pool
  .connect()
  .then(() => {
    console.log("Conexión a SQL Server establecida exitosamente");
    return pool;
  })
  .catch((err) => {
    console.error("Error al conectar a SQL Server:");
    console.error("   - Mensaje:", err.message);
    console.error("   - Código:", err.code);
    console.error("   - Número:", err.number);

    // Sugerencias de solución basadas en el tipo de error
    if (err.code === "ECONNREFUSED") {
      console.error(
        "Sugerencia: Verifica que SQL Server esté ejecutándose y que el puerto esté abierto"
      );
    } else if (err.code === "ENOTFOUND") {
      console.error(
        "Sugerencia: Verifica la dirección del servidor en DB_SERVER"
      );
    } else if (err.number === 18456) {
      console.error(
        "Sugerencia: Verifica las credenciales de usuario y contraseña"
      );
    } else if (err.number === 4060) {
      console.error(
        "Sugerencia: Verifica que la base de datos especificada existe"
      );
    }

    throw err;
  });

// Función para probar la conexión
const testConnection = async () => {
  try {
    await poolConnect;
    const request = pool.request();
    const result = await request.query(
      "SELECT GETDATE() as CurrentTime, @@VERSION as SQLVersion"
    );
    console.log("Prueba de conexión exitosa:", result.recordset[0]);
    return true;
  } catch (error) {
    console.error("Error en la prueba de conexión:", error);
    return false;
  }
};

// Cerrar conexión cuando la aplicación termina
process.on("SIGINT", async () => {
  console.log("Recibida señal de terminación, cerrando conexiones...");
  await closeConnection();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Recibida señal de terminación, cerrando conexiones...");
  await closeConnection();
  process.exit(0);
});

// Exportamos el pool y funciones útiles
module.exports = {
  sql,
  pool,
  poolConnect,
  testConnection,
};
