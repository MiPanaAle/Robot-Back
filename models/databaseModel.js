import net from 'node:net';

export class TcpClientModel {
  static TCP_HOST = process.env.TCP_HOST || 'localhost';
  static TCP_PORT = process.env.TCP_PORT || 3002;

  static async sendCommand(commandObj) {
    return new Promise((resolve, reject) => {
      const client = net.createConnection({ 
        port: this.TCP_PORT, 
        host: this.TCP_HOST 
      }, () => {
        console.log('Conectado al servidor TCP');
        client.write(JSON.stringify(commandObj));
      });

      let dataBuffer = '';
      client.on('data', (data) => {
        dataBuffer += data.toString();
      });

      client.on('end', () => {
        try {
          const response = JSON.parse(dataBuffer);
          if (response.status === 'SUCCESS') {
            resolve(response.data);
          } else {
            reject(new Error(response.message || 'Error en servidor TCP'));
          }
        } catch (error) {
          reject(new Error('Respuesta TCP inválida: ' + error.message));
        }
      });

      client.on('error', (err) => {
        console.error('Error en cliente TCP:', err);
        reject(new Error('Error de conexión TCP: ' + err.message));
      });

      // Timeout para evitar conexiones colgadas
      client.setTimeout(5000, () => {
        client.destroy();
        reject(new Error('Timeout en conexión TCP'));
      });
    });
  }

  // Obtener todos los robots
  static async getAllItems() {
    try {
      const response = await this.sendCommand({
        command: 'GET_ALL_ROBOTS'
      });
      return response;
    } catch (error) {
      console.error('Error al obtener todos los robots:', error);
      throw error;
    }
  }

  // Obtener posiciones de todos los robots
  static async getRobotPositions() {
    try {
      const response = await this.sendCommand({
        command: 'GET_ROBOT_POSITIONS'
      });
      return response;
    } catch (error) {
      console.error('Error al obtener posiciones:', error);
      throw error;
    }
  }

  // Obtener robot por ID
  static async getRobotById(robotId) {
    try {
      const response = await this.sendCommand({
        command: 'GET_ROBOT_BY_ID',
        params: { robotId }
      });
      return response;
    } catch (error) {
      console.error('Error al obtener robot por ID:', error);
      throw error;
    }
  }

  // Actualizar posición de robot
  static async updateRobotPosition(robotData) {
    try {
      const response = await this.sendCommand({
        command: 'UPDATE_ROBOT_POSITION',
        params: robotData
      });
      return response;
    } catch (error) {
      console.error('Error al actualizar posición:', error);
      throw error;
    }
  }

  // Actualizar velocidad de robot
  static async updateRobotSpeed(robotData) {
    try {
      const response = await this.sendCommand({
        command: 'UPDATE_ROBOT_SPEED',
        params: robotData
      });
      return response;
    } catch (error) {
      console.error('Error al actualizar velocidad:', error);
      throw error;
    }
  }

  // Actualizar batería de robot
  static async updateRobotBattery(robotData) {
    try {
      const response = await this.sendCommand({
        command: 'UPDATE_ROBOT_BATTERY',
        params: robotData
      });
      return response;
    } catch (error) {
      console.error('Error al actualizar batería:', error);
      throw error;
    }
  }

  // Crear o actualizar robot (método heredado)
  static async createItem(robotData) {
    try {
      const response = await this.sendCommand({
        command: 'UPDATE_ROBOT_POSITION',
        params: robotData
      });
      return response;
    } catch (error) {
      console.error('Error al crear/actualizar robot:', error);
      throw error;
    }
  }

  // Verificar conexión con el servidor TCP
  static async ping() {
    try {
      const response = await this.sendCommand({
        command: 'PING'
      });
      return response;
    } catch (error) {
      console.error('Error en ping:', error);
      throw error;
    }
  }
}