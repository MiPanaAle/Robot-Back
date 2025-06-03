import net from 'net';
import { RobotModel } from './models/robotModel'; 
import dotenv from 'dotenv';

dotenv.config();

// Protocolo TCP
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

// Manejadores de comandos
class CommandHandlers {
  static async handleGetAllRobots() {
    try {
      const robots = await RobotModel.getAllRobots();
      return TCPProtocol.createResponse(
        TCPProtocol.STATUS.SUCCESS,
        robots,
        "Robots obtenidos exitosamente"
      );
    } catch (error) {
      return TCPProtocol.createResponse(
        TCPProtocol.STATUS.ERROR,
        null,
        error.message
      );
    }
  }

  static async handleGetRobotPositions() {
    try {
      const positions = await RobotModel.getRobotPositions();
      return TCPProtocol.createResponse(
        TCPProtocol.STATUS.SUCCESS,
        positions,
        "Posiciones obtenidas exitosamente"
      );
    } catch (error) {
      return TCPProtocol.createResponse(
        TCPProtocol.STATUS.ERROR,
        null,
        error.message
      );
    }
  }

static async handleUpdateRobotPosition(params) {
  try {
    const { robotId, x, y, battery } = params;
    const updatedRobot = await RobotModel.updateRobotPosition({
      robotId,
      x,
      y,
      battery
    });
    } catch (error) {
      return TCPProtocol.createResponse(
        TCPProtocol.STATUS.ERROR,
        null,
        error.message
      );
    }
  }

  static async handleGetRobotById(params) {
    try {
      const { robotId } = params;
      const robot = await RobotModel.getRobotById(robotId);
      if (!robot) {
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.NOT_FOUND,
          null,
          "Robot no encontrado"
        );
      }
      return TCPProtocol.createResponse(
        TCPProtocol.STATUS.SUCCESS,
        robot,
        "Robot obtenido exitosamente"
      );
    } catch (error) {
      return TCPProtocol.createResponse(
        TCPProtocol.STATUS.ERROR,
        null,
        error.message
      );
    }
  }

  static async handleUpdateRobotSpeed(params) {
    try {
      const { robotId, speed } = params;
      const updatedRobot = await RobotModel.updateRobotSpeed(robotId, speed);
      return TCPProtocol.createResponse(
        TCPProtocol.STATUS.SUCCESS,
        updatedRobot,
        "Velocidad actualizada exitosamente"
      );
    } catch (error) {
      return TCPProtocol.createResponse(
        TCPProtocol.STATUS.ERROR,
        null,
        error.message
      );
    }
  }

  static async handleUpdateRobotBattery(params) {
    try {
      const { robotId, battery } = params;
      const updatedRobot = await RobotModel.updateRobotBattery(robotId, battery);
      return TCPProtocol.createResponse(
        TCPProtocol.STATUS.SUCCESS,
        updatedRobot,
        "Batería actualizada exitosamente"
      );
    } catch (error) {
      return TCPProtocol.createResponse(
        TCPProtocol.STATUS.ERROR,
        null,
        error.message
      );
    }
  }

  static handlePing() {
    return TCPProtocol.createResponse(
      TCPProtocol.STATUS.SUCCESS,
      { timestamp: new Date().toISOString() },
      "Pong"
    );
  }
}

// Función para crear el servidor TCP
function createTCPServer() {
  const server = net.createServer((socket) => {
    console.log(`Cliente conectado desde ${socket.remoteAddress}:${socket.remotePort}`);

    socket.on('data', async (data) => {
      console.log('Datos recibidos:', data.toString());
      
      const request = TCPProtocol.parseRequest(data);
      if (!request) {
        const errorResponse = TCPProtocol.createResponse(
          TCPProtocol.STATUS.INVALID_REQUEST,
          null,
          "Formato de solicitud inválido"
        );
        socket.write(errorResponse);
        return;
      }

      let response;
      
      try {
        switch (request.command) {
          case TCPProtocol.COMMANDS.GET_ALL_ROBOTS:
            response = await CommandHandlers.handleGetAllRobots();
            break;
            
          case TCPProtocol.COMMANDS.GET_ROBOT_POSITIONS:
            response = await CommandHandlers.handleGetRobotPositions();
            break;
            
          case TCPProtocol.COMMANDS.UPDATE_ROBOT_POSITION:
            response = await CommandHandlers.handleUpdateRobotPosition(request.params);
            break;
            
          case TCPProtocol.COMMANDS.GET_ROBOT_BY_ID:
            response = await CommandHandlers.handleGetRobotById(request.params);
            break;
            
          case TCPProtocol.COMMANDS.UPDATE_ROBOT_SPEED:
            response = await CommandHandlers.handleUpdateRobotSpeed(request.params);
            break;
            
          case TCPProtocol.COMMANDS.UPDATE_ROBOT_BATTERY:
            response = await CommandHandlers.handleUpdateRobotBattery(request.params);
            break;
            
          case TCPProtocol.COMMANDS.PING:
            response = CommandHandlers.handlePing();
            break;
            
          default:
            response = TCPProtocol.createResponse(
              TCPProtocol.STATUS.INVALID_REQUEST,
              null,
              `Comando no reconocido: ${request.command}`
            );
        }
      } catch (error) {
        console.error('Error procesando comando:', error);
        response = TCPProtocol.createResponse(
          TCPProtocol.STATUS.ERROR,
          null,
          `Error interno del servidor: ${error.message}`
        );
      }

      socket.write(response);
    });

    socket.on('end', () => {
      console.log('Cliente desconectado');
    });

    socket.on('error', (err) => {
      console.error('Error en socket:', err);
    });
  });

  server.on('error', (err) => {
    console.error('Error en servidor TCP:', err);
  });

  return server;
}

// Iniciar servidor TCP
const TCP_PORT = process.env.TCP_PORT || 3002;
const server = createTCPServer();
server.listen(TCP_PORT, () => {
  console.log(`✅ Servidor TCP corriendo en puerto ${TCP_PORT}`);
  console.log(`✅ Comandos disponibles:`);
  console.log(`   - GET_ALL_ROBOTS: Obtener todos los robots`);
  console.log(`   - GET_ROBOT_POSITIONS: Obtener posiciones de todos los robots`);
  console.log(`   - UPDATE_ROBOT_POSITION: Actualizar posición de un robot`);
  console.log(`   - GET_ROBOT_BY_ID: Obtener robot por ID`);
  console.log(`   - UPDATE_ROBOT_SPEED: Actualizar velocidad de un robot`);
  console.log(`   - UPDATE_ROBOT_BATTERY: Actualizar batería de un robot`);
  console.log(`   - PING: Verificar conexión`);
});