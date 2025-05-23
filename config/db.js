const net = require("net");
const { poolConnect } = require("./config/db");
const RobotModel = require("./models/robotModel");
require("dotenv").config();

// Protocolo de comunicación TCP personalizado
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
      const transformedRobots = robots.map((robot) => ({
        id: robot.RobotCode,
        x: robot.X,
        y: robot.Y,
        bateria: robot.Battery,
        speed: robot.Speed,
      }));
      return TCPProtocol.createResponse(
        TCPProtocol.STATUS.SUCCESS,
        transformedRobots
      );
    } catch (error) {
      console.error("Error getting all robots:", error);
      return TCPProtocol.createResponse(
        TCPProtocol.STATUS.ERROR,
        null,
        error.message
      );
    }
  }

  static async handleGetRobotById(robotId) {
    try {
      if (!robotId || isNaN(parseInt(robotId))) {
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.INVALID_REQUEST,
          null,
          "ID de robot inválido"
        );
      }

      const robot = await RobotModel.getRobotById(parseInt(robotId));
      if (robot) {
        const transformedRobot = {
          id: robot.RobotCode,
          x: robot.X,
          y: robot.Y,
          bateria: robot.Battery,
          speed: robot.Speed,
        };
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.SUCCESS,
          transformedRobot
        );
      } else {
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.NOT_FOUND,
          null,
          "Robot no encontrado"
        );
      }
    } catch (error) {
      console.error("Error getting robot by ID:", error);
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
      const transformedPositions = positions.map((pos) => ({
        robotCode: pos.RobotCode,
        x: pos.X,
        y: pos.Y,
        battery: pos.Battery,
        speed: pos.Speed,
      }));
      return TCPProtocol.createResponse(
        TCPProtocol.STATUS.SUCCESS,
        transformedPositions
      );
    } catch (error) {
      console.error("Error getting robot positions:", error);
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

      if (!robotId || isNaN(parseInt(robotId))) {
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.INVALID_REQUEST,
          null,
          "ID de robot inválido"
        );
      }

      if (x === undefined || y === undefined) {
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.INVALID_REQUEST,
          null,
          "Se requieren las coordenadas X e Y"
        );
      }

      const batteryLevel = battery !== undefined ? battery : 100;

      const updatedRobot = await RobotModel.updateRobotPosition(
        parseInt(robotId),
        parseFloat(x),
        parseFloat(y),
        parseFloat(batteryLevel)
      );

      if (updatedRobot) {
        const transformedRobot = {
          id: updatedRobot.RobotCode,
          x: updatedRobot.X,
          y: updatedRobot.Y,
          bateria: updatedRobot.Battery,
          speed: updatedRobot.Speed,
        };
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.SUCCESS,
          transformedRobot
        );
      } else {
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.NOT_FOUND,
          null,
          "Robot no encontrado"
        );
      }
    } catch (error) {
      console.error("Error updating robot position:", error);
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

      if (!robotId || isNaN(parseInt(robotId))) {
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.INVALID_REQUEST,
          null,
          "ID de robot inválido"
        );
      }

      if (speed === undefined) {
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.INVALID_REQUEST,
          null,
          "Se requiere la velocidad"
        );
      }

      const updatedRobot = await RobotModel.updateRobotSpeed(
        parseInt(robotId),
        parseFloat(speed)
      );

      if (updatedRobot) {
        const transformedRobot = {
          id: updatedRobot.RobotCode,
          x: updatedRobot.X,
          y: updatedRobot.Y,
          bateria: updatedRobot.Battery,
          speed: updatedRobot.Speed,
        };
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.SUCCESS,
          transformedRobot
        );
      } else {
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.NOT_FOUND,
          null,
          "Robot no encontrado"
        );
      }
    } catch (error) {
      console.error("Error updating robot speed:", error);
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

      if (!robotId || isNaN(parseInt(robotId))) {
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.INVALID_REQUEST,
          null,
          "ID de robot inválido"
        );
      }

      if (battery === undefined) {
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.INVALID_REQUEST,
          null,
          "Se requiere el nivel de batería"
        );
      }

      const updatedRobot = await RobotModel.updateRobotBattery(
        parseInt(robotId),
        parseFloat(battery)
      );

      if (updatedRobot) {
        const transformedRobot = {
          id: updatedRobot.RobotCode,
          x: updatedRobot.X,
          y: updatedRobot.Y,
          bateria: updatedRobot.Battery,
          speed: updatedRobot.Speed,
        };
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.SUCCESS,
          transformedRobot
        );
      } else {
        return TCPProtocol.createResponse(
          TCPProtocol.STATUS.NOT_FOUND,
          null,
          "Robot no encontrado"
        );
      }
    } catch (error) {
      console.error("Error updating robot battery:", error);
      return TCPProtocol.createResponse(
        TCPProtocol.STATUS.ERROR,
        null,
        error.message
      );
    }
  }
}

// Manejador principal de mensajes TCP
async function handleTCPMessage(socket, request) {
  let response;

  switch (request.command) {
    case TCPProtocol.COMMANDS.PING:
      response = TCPProtocol.createResponse(TCPProtocol.STATUS.SUCCESS, {
        message: "pong",
      });
      break;

    case TCPProtocol.COMMANDS.GET_ALL_ROBOTS:
      response = await CommandHandlers.handleGetAllRobots();
      break;

    case TCPProtocol.COMMANDS.GET_ROBOT_BY_ID:
      response = await CommandHandlers.handleGetRobotById(
        request.params?.robotId
      );
      break;

    case TCPProtocol.COMMANDS.GET_ROBOT_POSITIONS:
      response = await CommandHandlers.handleGetRobotPositions();
      break;

    case TCPProtocol.COMMANDS.UPDATE_ROBOT_POSITION:
      response = await CommandHandlers.handleUpdateRobotPosition(
        request.params
      );
      break;

    case TCPProtocol.COMMANDS.UPDATE_ROBOT_SPEED:
      response = await CommandHandlers.handleUpdateRobotSpeed(request.params);
      break;

    case TCPProtocol.COMMANDS.UPDATE_ROBOT_BATTERY:
      response = await CommandHandlers.handleUpdateRobotBattery(request.params);
      break;

    default:
      response = TCPProtocol.createResponse(
        TCPProtocol.STATUS.INVALID_REQUEST,
        null,
        `Comando no reconocido: ${request.command || "N/A"}`
      );
  }

  return response;
}

// Crear servidor TCP
function createTCPServer() {
  const server = net.createServer();

  server.on("connection", (socket) => {
    const clientInfo = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`Cliente conectado desde: ${clientInfo}`);

    // Configurar timeout para conexiones inactivas
    socket.setTimeout(300000); // 5 minutos

    socket.on("timeout", () => {
      console.log(`Timeout para cliente: ${clientInfo}`);
      socket.end();
    });

    socket.on("data", async (data) => {
      try {
        // Los datos pueden venir en múltiples chunks, acumularlos
        const requestData = data.toString().trim();
        console.log(`Solicitud recibida de ${clientInfo}:`, requestData);

        const request = TCPProtocol.parseRequest(requestData);

        if (!request) {
          const errorResponse = TCPProtocol.createResponse(
            TCPProtocol.STATUS.INVALID_REQUEST,
            null,
            "Formato de solicitud inválido. Debe ser JSON válido."
          );
          socket.write(errorResponse + "\n");
          return;
        }

        const response = await handleTCPMessage(socket, request);
        socket.write(response + "\n");
      } catch (error) {
        console.error(`Error procesando solicitud de ${clientInfo}:`, error);
        const errorResponse = TCPProtocol.createResponse(
          TCPProtocol.STATUS.ERROR,
          null,
          "Error interno del servidor"
        );
        socket.write(errorResponse + "\n");
      }
    });

    socket.on("close", () => {
      console.log(`Cliente desconectado: ${clientInfo}`);
    });

    socket.on("error", (error) => {
      console.error(`Error en conexión con ${clientInfo}:`, error.message);
    });

    // Enviar mensaje de bienvenida
    const welcomeMessage = TCPProtocol.createResponse(
      TCPProtocol.STATUS.SUCCESS,
      {
        message: "Robot Management TCP Server",
        availableCommands: Object.values(TCPProtocol.COMMANDS),
      }
    );
    socket.write(welcomeMessage + "\n");
  });

  server.on("error", (error) => {
    console.error("Error en el servidor TCP:", error);
  });

  return server;
}

// Iniciar el servidor
async function startTCPServer() {
  try {
    // Conectar a la base de datos primero
    console.log("Intentando conectar a la base de datos...");
    await poolConnect;
    console.log("Conexión a SQL Server establecida correctamente");

    // Crear y configurar el servidor TCP
    const server = createTCPServer();
    const PORT = process.env.TCP_PORT || 3001;

    server.listen(PORT, () => {
      console.log(`Servidor TCP corriendo en el puerto ${PORT}`);
      console.log(`Comando de prueba: telnet localhost ${PORT}`);
    });

    // Manejar cierre graceful
    process.on("SIGINT", () => {
      console.log("\nRecibida señal de terminación, cerrando servidor...");
      server.close(() => {
        console.log("Servidor TCP cerrado");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Error al inicializar el servidor TCP:", error.message);
    console.error("Detalles del error:", error);
    process.exit(1);
  }
}

// Manejar errores no capturados
process.on("unhandledRejection", (err) => {
  console.error(`Error no capturado: ${err.message}`);
  console.error("Cerrando el servidor debido a un error no capturado");
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error(`Excepción no capturada: ${err.message}`);
  console.error("Cerrando el servidor debido a una excepción no capturada");
  process.exit(1);
});

// Iniciar la aplicación
startTCPServer();
