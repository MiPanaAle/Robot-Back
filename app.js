const express = require('express');
const { poolConnect } = require('./config/db');
require('dotenv').config();

// Inicializar el servidor Express
const app = express();

// Definir el puerto
const PORT = process.env.PORT;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT} en modo ${process.env.NODE_ENV}`);
});

// Manejar errores no capturados
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Cerrando el servidor debido a un error no capturado');
  process.exit(1);
});