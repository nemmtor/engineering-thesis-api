import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SocketsGateway {
  @WebSocketServer() wss: Server;

  sendNotification(message: string, channel: string) {
    this.wss.emit(channel, message);
  }
}
