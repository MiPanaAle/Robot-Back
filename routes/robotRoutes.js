const express = require('express');
const router = express.Router();
const RobotController = require('../controllers/robotController');

router.post('/robots', RobotController.createRobot);          // Ruta para crear un robots
router.get('/robots', RobotController.getAllRobots);          // Ruta para listar robots
router.get('/robots/:code', RobotController.getRobotByCode);  // Ruta para obtener un robot
router.patch('/robots/:code', RobotController.updateRobot);   // Ruta para actualizar robots
router.delete('/robots/:code', RobotController.deleteRobot);  // Ruta para eliminar robots

module.exports = router;
