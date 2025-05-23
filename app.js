import express from 'express';
import cors from 'cors';
import { ItemsController } from './controllers/robotController.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/api/robots', ItemsController.getAllItems);
app.post('/api/robots', ItemsController.createItem);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

// Middleware de error 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`
  });
});

// Iniciar servidor HTTP
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor HTTP (API REST) corriendo en http://localhost:${PORT}`);
  console.log(`✅ Rutas disponibles:`);
  console.log(`   GET  /api/robots - Obtener todos los robots`);
  console.log(`   POST /api/robots - Crear/actualizar robot`);
  console.log(`   GET  /api/health - Estado de la API`);
});