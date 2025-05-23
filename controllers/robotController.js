import { TcpClientModel } from '../models/robotModel.js';

export class ItemsController {
  static async getAllItems(req, res) {
    try {
      const items = await TcpClientModel.getAllItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener items' });
    }
  }

  static async createItem(req, res) {
    try {
      const { name } = req.body;
      await TcpClientModel.createItem(name);
      res.sendStatus(201);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear item' });
    }
  }
}