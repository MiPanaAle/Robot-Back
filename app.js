const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { poolConnect } = require('./config/db');
require('dotenv').config();

// Función principal para inicializar la aplicación
const startServer = async () => {
  try {
    // Primero intentamos conectar a la base de datos
    console.log('🔌 Intentando conectar a la base de datos...');
    await poolConnect;
    console.log('✅ Conexión a SQL Server establecida correctamente');
  }catch(error){
    console.log(error)
  }
}
// Función para configurar el servidor Express
const configureServer = () => {
  const app = express();
  const front = process.env.FRONTEND_URL;
  console.log('🌐 Frontend URL:', front);

  // Middleware para parsear JSON
  app.use(express.json());
  
  // Middleware para parsear URL-encoded bodies
  app.use(express.urlencoded({ extended: true }));
  
  // Configuración de CORS
  app.use(cors({
    origin: front || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Ruta base para verificar que el servidor está funcionando
  app.get('/', (req, res) => {
    res.json({ message: 'Robot Management API is running' });
  });

  // Importamos y usamos las rutas de robots
  const robotRoutes = require('./routes/robotRoutes');
  app.use('/api/robots', robotRoutes);

  // Middleware para manejar rutas no encontradas
  app.use(notFound);
  
  // Middleware para manejar errores
  app.use(errorHandler);

  return app;
};

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