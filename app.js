import express from 'express';
import cors from 'cors';
import { ItemsController } from './controllers/robotController.js';

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Para React dev server
  credentials: true
}));
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas principales
app.get('/robots', ItemsController.getAllItems);
app.get('/robots/positions', ItemsController.getRobotPositions);
app.get('/robots/:id', ItemsController.getRobotById);
app.put('/robots/:id/position', ItemsController.updateRobotPosition);
app.put('/robots/:id/speed', ItemsController.updateRobotSpeed);
app.put('/robots/:id/battery', ItemsController.updateRobotBattery);
app.post('/robots', ItemsController.createItem);

// Rutas con prefijo /api (para compatibilidad)
app.get('/api/robots', ItemsController.getAllItems);
app.get('/api/robots/positions', ItemsController.getRobotPositions);
app.get('/api/robots/:id', ItemsController.getRobotById);
app.put('/api/robots/:id/position', ItemsController.updateRobotPosition);
app.put('/api/robots/:id/speed', ItemsController.updateRobotSpeed);
app.put('/api/robots/:id/battery', ItemsController.updateRobotBattery);
app.post('/api/robots', ItemsController.createItem);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware de error 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en la aplicación:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor HTTP
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor HTTP (API REST) corriendo en http://localhost:${PORT}`);
  console.log(`✅ Rutas disponibles:`);
  console.log(`   GET  /robots - Obtener todos los robots`);
  console.log(`   GET  /robots/positions - Obtener posiciones de todos los robots`);
  console.log(`   GET  /robots/:id - Obtener robot por ID`);
  console.log(`   PUT  /robots/:id/position - Actualizar posición de robot`);
  console.log(`   PUT  /robots/:id/speed - Actualizar velocidad de robot`);
  console.log(`   PUT  /robots/:id/battery - Actualizar batería de robot`);
  console.log(`   POST /robots - Crear/actualizar robot`);
  console.log(`   GET  /health - Estado de la API`);
});