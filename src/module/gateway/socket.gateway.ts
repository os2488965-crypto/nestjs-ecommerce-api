/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Types } from 'mongoose';
import { Socket } from 'socket.io';

@WebSocketGateway(80, {
  namespace: '/socket',
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

  @WebSocketServer()
  private io: Server;

  @SubscribeMessage('sayHi')
  handleSayHiEvent(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    this.io.emit('sayHi', { msg: 'hi from be' });
  }

  handleConnection(socket: Socket) {
    // console.log(socket);
    console.log('client connected');
  }

  handleDisconnect(socket: Socket) {
    // console.log(socket.id);
    console.log('client disconnected');
  }

  handleProductQuantityChange(
    productId: Types.ObjectId | string,
    quantity: number,
  ) {
    this.io.emit('productQuantityChange', { productId, quantity });
  }
}
