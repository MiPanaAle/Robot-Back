const { configureServer } = require('./config/index');
const { poolConnect } = require('./config/db');
require('dotenv').config();

// Función principal para inicializar la aplicación
const startServer = async () => {
  try {
    // Primero intentamos conectar a la base de datos
    console.log('🔌 Intentando conectar a la base de datos...');
    await poolConnect;
    console.log('✅ Conexión a SQL Server establecida correctamente');
    
    // Configuramos el servidor Express
    const app = configureServer();
    
    // Definir el puerto
    const PORT = process.env.PORT || 3000;
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT} en modo ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 API disponible en: http://localhost:${PORT}`);
      console.log(`🤖 Endpoints de robots: http://localhost:${PORT}/api/robots`);
    });
    
  } catch (error) {
    console.error('❌ Error al inicializar la aplicación:', error.message);
    console.error('Detalles del error:', error);
    process.exit(1);
  }
};

// Manejar errores no capturados
process.on('unhandledRejection', (err) => {
  console.error(`❌ Error no capturado: ${err.message}`);
  console.error('Cerrando el servidor debido a un error no capturado');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error(`❌ Excepción no capturada: ${err.message}`);
  console.error('Cerrando el servidor debido a una excepción no capturada');
  process.exit(1);
});

// Iniciar la aplicación
startServer();