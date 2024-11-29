import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
class SocketClient {
  private static instance: SocketClient;
  public socket: Socket;
  public token = Cookies.get('user')
  
  private constructor() {
    this.socket = io('http://localhost:3000', {
      query: {
        token: this.token,
      },
    });
  }

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  connect(): void {
    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      console.log(this.socket.id)
    });
  }

   subscribeTo(event: string, callback: (data: unknown) => void): void {
  this.socket.on(event, data => {
    callback(data);
  });
}

}

export default SocketClient.getInstance();
