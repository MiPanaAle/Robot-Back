import express from 'express';
import cors from 'cors';
import { ItemsController } from './controllers/robotController.js'; 

// Configuración inicial
const app = express();
app.use(cors());
app.use(express.json());

// Definición de rutas
app.get('/api/items', ItemsController.getAllItems);
app.post('/api/items', ItemsController.createItem);

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor Express escuchando en http://localhost:${PORT}`);
});
