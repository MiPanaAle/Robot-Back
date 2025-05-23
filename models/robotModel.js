import net from 'node:net';

export class TcpClientModel {
  static async sendCommand(commandObj) {
    return new Promise((resolve, reject) => {
      const client = net.createConnection({ port: 3002 }, () => {
        client.write(JSON.stringify(commandObj));
      });

      let dataBuffer = '';
      client.on('data', (data) => {
        dataBuffer += data.toString();
      });

      client.on('end', () => {
        try {
          const response = JSON.parse(dataBuffer);
          resolve(response);
        } catch (error) {
          reject(new Error('Respuesta TCP inválida'));
        }
      });

      client.on('error', (err) => {
        reject(err);
      });
    });
  }

  static async getAllItems() {
    const response = await this.sendCommand({
      command: 'GET_ALL_ROBOTS'
    });
    
    if (response.status === 'SUCCESS') {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  }

  static async createItem(robotData) {
    const response = await this.sendCommand({
      command: 'UPDATE_ROBOT_POSITION',
      params: robotData
    });
    
    if (response.status === 'SUCCESS') {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  }
}