import sql from 'mssql';
import { poolConnect } from '../config/db.js';

export class RobotModel {
  static async getAllRobots() {
    try {
      await poolConnect;
      const result = await sql.query`SELECT * FROM Robots`;
      return result.recordset;
    } catch (error) {
      throw new Error(`Error al obtener robots: ${error.message}`);
    }
  }

  static async getRobotById(robotId) {
    try {
      await poolConnect;
      const result = await sql.query`SELECT * FROM Robots WHERE RobotCode = ${robotId}`;
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error al obtener robot: ${error.message}`);
    }
  }

  static async getRobotPositions() {
    try {
      await poolConnect;
      const result = await sql.query`SELECT RobotCode, X, Y, Battery, Speed FROM Robots`;
      return result.recordset;
    } catch (error) {
      throw new Error(`Error al obtener posiciones: ${error.message}`);
    }
  }

  static async updateRobotPosition(robotId, x, y, battery) {
    try {
      await poolConnect;
      await sql.query`UPDATE Robots SET X = ${x}, Y = ${y}, Battery = ${battery} WHERE RobotCode = ${robotId}`;
      return await this.getRobotById(robotId);
    } catch (error) {
      throw new Error(`Error al actualizar posición: ${error.message}`);
    }
  }

  static async updateRobotSpeed(robotId, speed) {
    try {
      await poolConnect;
      await sql.query`UPDATE Robots SET Speed = ${speed} WHERE RobotCode = ${robotId}`;
      return await this.getRobotById(robotId);
    } catch (error) {
      throw new Error(`Error al actualizar velocidad: ${error.message}`);
    }
  }

  static async updateRobotBattery(robotId, battery) {
    try {
      await poolConnect;
      await sql.query`UPDATE Robots SET Battery = ${battery} WHERE RobotCode = ${robotId}`;
      return await this.getRobotById(robotId);
    } catch (error) {
      throw new Error(`Error al actualizar batería: ${error.message}`);
    }
  }
}