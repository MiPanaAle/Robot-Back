import { TcpClientModel } from '../models/robotModel.js';

export class ItemsController {
  // Obtener todos los robots
  static async getAllItems(req, res) {
    try {
      const items = await TcpClientModel.getAllItems();
      res.json({
        success: true,
        data: items
      });
    } catch (error) {
      console.error('Error en getAllItems:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener robots',
        message: error.message 
      });
    }
  }

  // Obtener posiciones de todos los robots
  static async getRobotPositions(req, res) {
    try {
      const positions = await TcpClientModel.getRobotPositions();
      // Transformar los datos para que coincidan con el formato esperado por el frontend
      const transformedData = positions.map(robot => ({
        robotCode: robot.RobotCode,
        x: robot.X || Math.random() * 500, // Valores por defecto si no existen
        y: robot.Y || Math.random() * 300,
        battery: robot.Battery || 100,
        speed: robot.Speed || 1
      }));
      
      res.json(transformedData);
    } catch (error) {
      console.error('Error en getRobotPositions:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener posiciones de robots',
        message: error.message 
      });
    }
  }

  // Obtener robot por ID
  static async getRobotById(req, res) {
    try {
      const { id } = req.params;
      const robot = await TcpClientModel.getRobotById(id);
      
      if (!robot) {
        return res.status(404).json({
          success: false,
          message: 'Robot no encontrado'
        });
      }

      res.json({
        success: true,
        data: robot
      });
    } catch (error) {
      console.error('Error en getRobotById:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener robot',
        message: error.message 
      });
    }
  }

  // Actualizar posición de un robot
  static async updateRobotPosition(req, res) {
    try {
      const { id } = req.params;
      const { x, y, battery } = req.body;
      
      const result = await TcpClientModel.updateRobotPosition({
        robotId: id,
        x: x,
        y: y,
        battery: battery
      });
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error en updateRobotPosition:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al actualizar posición del robot',
        message: error.message 
      });
    }
  }

  // Actualizar velocidad de un robot
  static async updateRobotSpeed(req, res) {
    try {
      const { id } = req.params;
      const { speed } = req.body;
      
      const result = await TcpClientModel.updateRobotSpeed({
        robotId: id,
        speed: speed
      });
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error en updateRobotSpeed:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al actualizar velocidad del robot',
        message: error.message 
      });
    }
  }

  // Actualizar batería de un robot
  static async updateRobotBattery(req, res) {
    try {
      const { id } = req.params;
      const { battery } = req.body;
      
      const result = await TcpClientModel.updateRobotBattery({
        robotId: id,
        battery: battery
      });
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error en updateRobotBattery:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al actualizar batería del robot',
        message: error.message 
      });
    }
  }

  // Crear o actualizar robot
  static async createItem(req, res) {
    try {
      const robotData = req.body;
      const result = await TcpClientModel.createItem(robotData);
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error en createItem:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al crear/actualizar robot',
        message: error.message 
      });
    }
  }
}