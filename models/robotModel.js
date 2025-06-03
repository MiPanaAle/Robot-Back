import dotenv from "dotenv";
import { getDB, sql } from "../config/db";

dotenv.config();

// Configuración de la base de datos
const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false, // Para conexiones locales
    trustServerCertificate: true,
  },
};

// Pool de conexiones
let pool;

async function getDB() {
  if (!pool) {
    try {
      pool = await sql.connect(dbConfig);
      console.log("✅ Conectado a SQL Server");
    } catch (err) {
      console.error("❌ Error conectando a la base de datos:", err);
      throw err;
    }
  }
  return pool;
}

export class TcpClientModel {
  // Obtener todos los robots
  static async getAllRobots() {
    try {
      const pool = await getDB();
      const result = await pool.request().query("SELECT * FROM Robots");
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Obtener posiciones de todos los robots
  static async getRobotPositions() {
    try {
      const pool = await getDB();
      const result = await pool
        .request()
        .query("SELECT RobotCode, X, Y, Battery, Speed FROM Robots");
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener posiciones:", error);
      throw error;
    }
  }

  // Obtener robot por ID
  static async getRobotById(robotId) {
    try {
      const pool = await getDB();
      const request = pool.request();
      request.input("RobotCode", sql.Int, robotId);
      const result = await request.query(
        "SELECT * FROM Robots WHERE RobotCode = @RobotCode"
      );
      return result.recordset[0];
    } catch (error) {
      console.error("Error al obtener robot por ID:", error);
      throw error;
    }
  }

  // Actualizar posición de robot
  static async updateRobotPosition(robotData) {
    try {
      const pool = await getDB();
      const request = pool.request();
      request.input("RobotCode", sql.Int, robotData.robotId);
      request.input("X", sql.Float, robotData.x);
      request.input("Y", sql.Float, robotData.y);
      request.input("Battery", sql.Float, robotData.battery);

      const result = await request.query(`
        UPDATE Robots 
        SET X = @X, Y = @Y, Battery = @Battery 
        WHERE RobotCode = @RobotCode;
        SELECT * FROM Robots WHERE RobotCode = @RobotCode;
      `);

      return result.recordset[0];
    } catch (error) {
      console.error("Error al actualizar posición:", error);
      throw error;
    }
  }

  // Actualizar velocidad de robot
  static async updateRobotSpeed(robotData) {
    try {
      const pool = await getDB();
      const request = pool.request();
      request.input("RobotCode", sql.Int, robotData.robotId);
      request.input("Speed", sql.Float, robotData.speed);

      const result = await request.query(`
        UPDATE Robots 
        SET Speed = @Speed 
        WHERE RobotCode = @RobotCode;
        SELECT * FROM Robots WHERE RobotCode = @RobotCode;
      `);

      return result.recordset[0];
    } catch (error) {
      console.error("Error al actualizar velocidad:", error);
      throw error;
    }
  }

  // Actualizar batería de robot
  static async updateRobotBattery(robotData) {
    try {
      const pool = await getDB();
      const request = pool.request();
      request.input("RobotCode", sql.Int, robotData.robotId);
      request.input("Battery", sql.Float, robotData.battery);

      const result = await request.query(`
        UPDATE Robots 
        SET Battery = @Battery 
        WHERE RobotCode = @RobotCode;
        SELECT * FROM Robots WHERE RobotCode = @RobotCode;
      `);

      return result.recordset[0];
    } catch (error) {
      console.error("Error al actualizar batería:", error);
      throw error;
    }
  }

  // Crear o actualizar robot
  static async createItem(robotData) {
    try {
      const pool = await getDB();
      const request = pool.request();
      request.input("X", sql.Float, robotData.x || 0);
      request.input("Y", sql.Float, robotData.y || 0);
      request.input("Battery", sql.Float, robotData.battery || 100);
      request.input("Speed", sql.Float, robotData.speed || 1);

      const result = await request.query(`
        INSERT INTO Robots (X, Y, Battery, Speed)
        OUTPUT INSERTED.*
        VALUES (@X, @Y, @Battery, @Speed)
      `);

      return result.recordset[0];
    } catch (error) {
      console.error("Error al crear robot:", error);
      throw error;
    }
  }
}
