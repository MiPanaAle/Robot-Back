const asyncHandler = require('express-async-handler');
const RobotModel = require('../models/robotModel');

/**
 * Controlador para manejar las operaciones relacionadas con robots
 */
const RobotController = {
  /**
   * @desc    Obtiene todos los robots
   * @route   GET /api/robots
   * @access  Public
   */
  getAllRobots: asyncHandler(async (req, res) => {
    const robots = await RobotModel.getAllRobots();
    
    // Transformamos los nombres de las propiedades para que coincidan con el frontend
    const transformedRobots = robots.map(robot => ({
      id: robot.RobotCode,
      x: robot.X,
      y: robot.Y,
      bateria: robot.Battery,
      speed: robot.Speed
    }));
    
    res.json(transformedRobots);
  }),

  /**
   * @desc    Obtiene un robot por su ID
   * @route   GET /api/robots/:id
   * @access  Public
   */
  getRobotById: asyncHandler(async (req, res) => {
    const robot = await RobotModel.getRobotById(parseInt(req.params.id));
    
    if (robot) {
      // Transformamos los nombres de las propiedades
      const transformedRobot = {
        id: robot.RobotCode,
        x: robot.X,
        y: robot.Y,
        bateria: robot.Battery,
        speed: robot.Speed
      };
      
      res.json(transformedRobot);
    } else {
      res.status(404);
      throw new Error('Robot no encontrado');
    }
  }),

  /**
   * @desc    Obtiene las posiciones de todos los robots
   * @route   GET /api/robots/positions
   * @access  Public
   */
  getRobotPositions: asyncHandler(async (req, res) => {
    const positions = await RobotModel.getRobotPositions();
    
    // Transformamos los nombres de las propiedades
    const transformedPositions = positions.map(pos => ({
      robotCode: pos.RobotCode,
      x: pos.X,
      y: pos.Y,
      battery: pos.Battery,
      speed: pos.Speed
    }));
    
    res.json(transformedPositions);
  }),

  /**
   * @desc    Actualiza la posición de un robot
   * @route   PUT /api/robots/:id/position
   * @access  Public
   */
  updateRobotPosition: asyncHandler(async (req, res) => {
    const { x, y, battery } = req.body;
    const robotId = parseInt(req.params.id);
    
    if (isNaN(robotId) || robotId <= 0) {
      res.status(400);
      throw new Error('ID de robot inválido');
    }
    
    if (x === undefined || y === undefined) {
      res.status(400);
      throw new Error('Se requieren las coordenadas X e Y');
    }
    
    // Si no se proporciona la batería, usamos un valor por defecto
    const batteryLevel = battery !== undefined ? battery : 100;
    
    const updatedRobot = await RobotModel.updateRobotPosition(
      robotId,
      parseFloat(x),
      parseFloat(y),
      parseFloat(batteryLevel)
    );
    
    if (updatedRobot) {
      // Transformamos los nombres de las propiedades
      const transformedRobot = {
        id: updatedRobot.RobotCode,
        x: updatedRobot.X,
        y: updatedRobot.Y,
        bateria: updatedRobot.Battery,
        speed: updatedRobot.Speed
      };
      
      res.json(transformedRobot);
    } else {
      res.status(404);
      throw new Error('Robot no encontrado');
    }
  }),

  /**
   * @desc    Actualiza la velocidad de un robot
   * @route   PUT /api/robots/:id/speed
   * @access  Public
   */
  updateRobotSpeed: asyncHandler(async (req, res) => {
    const { speed } = req.body;
    const robotId = parseInt(req.params.id);
    
    if (isNaN(robotId) || robotId <= 0) {
      res.status(400);
      throw new Error('ID de robot inválido');
    }
    
    if (speed === undefined) {
      res.status(400);
      throw new Error('Se requiere la velocidad');
    }
    
    const updatedRobot = await RobotModel.updateRobotSpeed(
      robotId,
      parseFloat(speed)
    );
    
    if (updatedRobot) {
      // Transformamos los nombres de las propiedades
      const transformedRobot = {
        id: updatedRobot.RobotCode,
        x: updatedRobot.X,
        y: updatedRobot.Y,
        bateria: updatedRobot.Battery,
        speed: updatedRobot.Speed
      };
      
      res.json(transformedRobot);
    } else {
      res.status(404);
      throw new Error('Robot no encontrado');
    }
  }),

  /**
   * @desc    Actualiza el nivel de batería de un robot
   * @route   PUT /api/robots/:id/battery
   * @access  Public
   */
  updateRobotBattery: asyncHandler(async (req, res) => {
    const { battery } = req.body;
    const robotId = parseInt(req.params.id);
    
    if (isNaN(robotId) || robotId <= 0) {
      res.status(400);
      throw new Error('ID de robot inválido');
    }
    
    if (battery === undefined) {
      res.status(400);
      throw new Error('Se requiere el nivel de batería');
    }
    
    const updatedRobot = await RobotModel.updateRobotBattery(
      robotId,
      parseFloat(battery)
    );
    
    if (updatedRobot) {
      // Transformamos los nombres de las propiedades
      const transformedRobot = {
        id: updatedRobot.RobotCode,
        x: updatedRobot.X,
        y: updatedRobot.Y,
        bateria: updatedRobot.Battery,
        speed: updatedRobot.Speed
      };
      
      res.json(transformedRobot);
    } else {
      res.status(404);
      throw new Error('Robot no encontrado');
    }
  })
};

module.exports = RobotController;