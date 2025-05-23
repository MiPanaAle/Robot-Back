import { TcpClientModel } from '../models/robotModel.js';

export class ItemsController {
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