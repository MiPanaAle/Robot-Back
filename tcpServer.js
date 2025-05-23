import net from 'net';
import { RobotModel } from './models/databaseModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Protocolo TCP (mantiene la misma lógica que tenías)
class TCPProtocol {
  static COMMANDS = {
    GET_ALL_ROBOTS: "GET_ALL_ROBOTS",
    GET_ROBOT_BY_ID: "GET_ROBOT_BY_ID",
    GET_ROBOT_POSITIONS: "GET_ROBOT_POSITIONS",
    UPDATE_ROBOT_POSITION: "UPDATE_ROBOT_POSITION",
    UPDATE_ROBOT_SPEED: "UPDATE_ROBOT_SPEED",
    UPDATE_ROBOT_BATTERY: "UPDATE_ROBOT_BATTERY",
    PING: "PING",
  };

  static STATUS = {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
    NOT_FOUND: "NOT_FOUND",
    INVALID_REQUEST: "INVALID_REQUEST",
  };

  static createResponse(status, data = null, message = "") {
    return JSON.stringify({
      status,
      data,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static parseRequest(rawData) {
    try {
      return JSON.parse(rawData.toString().trim());
    } catch (error) {
      return null;
    }
  }
}

// Iniciar servidor TCP en puerto 3002
const TCP_PORT = process.env.TCP_PORT || 3002;
const server = createTCPServer();
server.listen(TCP_PORT, () => {
  console.log(`✅ Servidor TCP corriendo en puerto ${TCP_PORT}`);
});
