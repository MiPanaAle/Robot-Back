const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Función para configurar el servidor Express
const configureServer = () => {
  const app = express();
  const front = process.env.FRONTEND_URL;
  console.log(front)

  // Middleware para parsear JSON
  app.use(express.json());
  
  // Middleware para parsear URL-encoded bodies
  app.use(express.urlencoded({ extended: true }));
  
  // Configuración de CORS
  app.use(cors({
    origin: front,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Ruta base para verificar que el servidor está funcionando
  app.get('/', (req, res) => {
    res.json({ message: 'Robot Management API is running' });
  });

  // Importamos y usamos las rutas de robots
  const robotRoutes = require('../routes/robotRoutes');
  app.use('/api/robots', robotRoutes);

  // Middleware para manejar rutas no encontradas
  app.use(notFound);
  
  // Middleware para manejar errores
  app.use(errorHandler);

  return app;
};

module.exports = { configureServer };