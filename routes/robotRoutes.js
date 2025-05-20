const express = require('express');
const router = express.Router();
const RobotController = require('../controllers/robotController');

// Rutas de robots

// GET /api/robots - Obtener todos los robots
router.get('/', RobotController.getAllRobots);

// GET /api/robots/positions - Obtener posiciones de todos los robots
router.get('/positions', RobotController.getRobotPositions);

// GET /api/robots/:id - Obtener un robot por ID
router.get('/:id', RobotController.getRobotById);

// PUT /api/robots/:id/position - Actualizar posición de un robot
router.put('/:id/position', RobotController.updateRobotPosition);

// PUT /api/robots/:id/speed - Actualizar velocidad de un robot
router.put('/:id/speed', RobotController.updateRobotSpeed);

// PUT /api/robots/:id/battery - Actualizar nivel de batería de un robot
router.put('/:id/battery', RobotController.updateRobotBattery);

module.exports = router;