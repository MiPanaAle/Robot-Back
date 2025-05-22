const { sql, pool } = require('../config/db');

/**
 * Modelo para manejar operaciones de robots en la base de datos
 */
const RobotModel = {
  /**
   * Obtiene todos los robots de la base de datos
   * @returns {Array} Array de robots
   */
  getAllRobots: async () => {
    try {
      const request = pool.request();
      const result = await request.query(`
        SELECT RobotCode, X, Y, Battery, Speed 
        FROM Robots 
        ORDER BY RobotCode
      `);
      return result.recordset;
    } catch (error) {
      console.error('Error al obtener todos los robots:', error);
      throw new Error('Error al consultar la base de datos');
    }
  },

  /**
   * Obtiene un robot por su ID
   * @param {number} robotId - ID del robot
   * @returns {Object|null} Robot encontrado o null
   */
  getRobotById: async (robotId) => {
    try {
      const request = pool.request();
      request.input('robotId', sql.Int, robotId);
      const result = await request.query(`
        SELECT RobotCode, X, Y, Battery, Speed 
        FROM Robots 
        WHERE RobotCode = @robotId
      `);
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Error al obtener robot por ID:', error);
      throw new Error('Error al consultar la base de datos');
    }
  },

  /**
   * Obtiene las posiciones de todos los robots
   * @returns {Array} Array con posiciones de robots
   */
  getRobotPositions: async () => {
    try {
      const request = pool.request();
      const result = await request.query(`
        SELECT RobotCode, X, Y, Battery, Speed 
        FROM Robots 
        ORDER BY RobotCode
      `);
      return result.recordset;
    } catch (error) {
      console.error('Error al obtener posiciones de robots:', error);
      throw new Error('Error al consultar la base de datos');
    }
  },

  /**
   * Actualiza la posición de un robot
   * @param {number} robotId - ID del robot
   * @param {number} x - Coordenada X
   * @param {number} y - Coordenada Y
   * @param {number} battery - Nivel de batería
   * @returns {Object|null} Robot actualizado o null
   */
  updateRobotPosition: async (robotId, x, y, battery) => {
    try {
      const request = pool.request();
      request.input('robotId', sql.Int, robotId);
      request.input('x', sql.Float, x);
      request.input('y', sql.Float, y);
      request.input('battery', sql.Float, battery);
      
      await request.query(`
        UPDATE Robots 
        SET X = @x, Y = @y, Battery = @battery 
        WHERE RobotCode = @robotId
      `);
      
      // Retornar el robot actualizado
      return await RobotModel.getRobotById(robotId);
    } catch (error) {
      console.error('Error al actualizar posición del robot:', error);
      throw new Error('Error al actualizar la base de datos');
    }
  },

  /**
   * Actualiza la velocidad de un robot
   * @param {number} robotId - ID del robot
   * @param {number} speed - Nueva velocidad
   * @returns {Object|null} Robot actualizado o null
   */
  updateRobotSpeed: async (robotId, speed) => {
    try {
      const request = pool.request();
      request.input('robotId', sql.Int, robotId);
      request.input('speed', sql.Float, speed);
      
      await request.query(`
        UPDATE Robots 
        SET Speed = @speed 
        WHERE RobotCode = @robotId
      `);
      
      // Retornar el robot actualizado
      return await RobotModel.getRobotById(robotId);
    } catch (error) {
      console.error('Error al actualizar velocidad del robot:', error);
      throw new Error('Error al actualizar la base de datos');
    }
  },

  /**
   * Actualiza el nivel de batería de un robot
   * @param {number} robotId - ID del robot
   * @param {number} battery - Nuevo nivel de batería
   * @returns {Object|null} Robot actualizado o null
   */
  updateRobotBattery: async (robotId, battery) => {
    try {
      const request = pool.request();
      request.input('robotId', sql.Int, robotId);
      request.input('battery', sql.Float, battery);
      
      await request.query(`
        UPDATE Robots 
        SET Battery = @battery 
        WHERE RobotCode = @robotId
      `);
      
      // Retornar el robot actualizado
      return await RobotModel.getRobotById(robotId);
    } catch (error) {
      console.error('Error al actualizar batería del robot:', error);
      throw new Error('Error al actualizar la base de datos');
    }
  }
};

module.exports = RobotModel;