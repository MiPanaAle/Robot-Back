const { sql, pool } = require('../config/db');

/**
 * Modelo para manejar las operaciones de la base de datos relacionadas con robots
 */
const RobotModel = {
  /**
   * Obtiene todos los robots de la base de datos
   */
  getAllRobots: async () => {
    try {
      await pool;
      const request = pool.request();
      const result = await request.query('SELECT * FROM Robots');
      return result.recordset;
    } catch (err) {
      console.error('Error al obtener todos los robots:', err);
      throw err;
    }
  },

  /**
   * Obtiene un robot por su ID
   */
  getRobotById: async (robotId) => {
    try {
      await pool;
      const request = pool.request();
      request.input('RobotCode', sql.Int, robotId);
      const result = await request.query('SELECT * FROM Robots WHERE RobotCode = @RobotCode');
      return result.recordset[0];
    } catch (err) {
      console.error('Error al obtener robot por ID:', err);
      throw err;
    }
  },

  /**
   * Obtiene las posiciones de todos los robots
   */
  getRobotPositions: async () => {
    try {
      await pool;
      const request = pool.request();
      const result = await request.query('SELECT RobotCode, X, Y, Battery, Speed FROM Robots');
      return result.recordset;
    } catch (err) {
      console.error('Error al obtener posiciones de robots:', err);
      throw err;
    }
  },

  /**
   * Actualiza la posición de un robot
   */
  updateRobotPosition: async (robotId, x, y, battery) => {
    try {
      await pool;
      const request = pool.request();
      request.input('RobotCode', sql.Int, robotId);
      request.input('X', sql.Float, x);
      request.input('Y', sql.Float, y);
      request.input('Battery', sql.Float, battery);
      
      const result = await request.query(`
        UPDATE Robots 
        SET X = @X, Y = @Y, Battery = @Battery 
        WHERE RobotCode = @RobotCode;
        SELECT * FROM Robots WHERE RobotCode = @RobotCode;
      `);
      
      return result.recordset[0];
    } catch (err) {
      console.error('Error al actualizar posición del robot:', err);
      throw err;
    }
  },

  /**
   * Actualiza la velocidad de un robot
   */
  updateRobotSpeed: async (robotId, speed) => {
    try {
      await pool;
      const request = pool.request();
      request.input('RobotCode', sql.Int, robotId);
      request.input('Speed', sql.Float, speed);
      
      const result = await request.query(`
        UPDATE Robots 
        SET Speed = @Speed 
        WHERE RobotCode = @RobotCode;
        SELECT * FROM Robots WHERE RobotCode = @RobotCode;
      `);
      
      return result.recordset[0];
    } catch (err) {
      console.error('Error al actualizar velocidad del robot:', err);
      throw err;
    }
  },

  /**
   * Actualiza el nivel de batería de un robot
   */
  updateRobotBattery: async (robotId, battery) => {
    try {
      await pool;
      const request = pool.request();
      request.input('RobotCode', sql.Int, robotId);
      request.input('Battery', sql.Float, battery);
      
      const result = await request.query(`
        UPDATE Robots 
        SET Battery = @Battery 
        WHERE RobotCode = @RobotCode;
        SELECT * FROM Robots WHERE RobotCode = @RobotCode;
      `);
      
      return result.recordset[0];
    } catch (err) {
      console.error('Error al actualizar batería del robot:', err);
      throw err;
    }
  },

  /**
   * Crea un nuevo robot en la base de datos
   */
  createRobot: async (robotData) => {
    try {
      await pool;
      const request = pool.request();
      request.input('X', sql.Float, robotData.x || 0);
      request.input('Y', sql.Float, robotData.y || 0);
      request.input('Battery', sql.Float, robotData.battery || 100);
      request.input('Speed', sql.Float, robotData.speed || 1);
      
      const result = await request.query(`
        INSERT INTO Robots (X, Y, Battery, Speed)
        OUTPUT INSERTED.*
        VALUES (@X, @Y, @Battery, @Speed)
      `);
      
      return result.recordset[0];
    } catch (err) {
      console.error('Error al crear robot:', err);
      throw err;
    }
  }
};

module.exports = RobotModel;
