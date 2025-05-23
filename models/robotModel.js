import net from 'node:net';

export class TcpClientModel {
  static async sendCommand(command) {
    return new Promise((resolve, reject) => {
      const client = net.createConnection({ port: 3000 }, () => {
        client.write(command);
      });

      let dataBuffer = '';
      client.on('data', (data) => {
        dataBuffer += data.toString();
      });

      client.on('end', () => {
        resolve(dataBuffer);
      });

      client.on('error', (err) => {
        reject(err);
      });
    });
  }

  // Métodos específicos para operaciones CRUD
  static async getAllItems() {
    const response = await this.sendCommand('GET_ALL_ITEMS');
    return JSON.parse(response);
  }

  static async createItem(name) {
    await this.sendCommand(`CREATE_ITEM:${name}`);
    return true;
  }
}