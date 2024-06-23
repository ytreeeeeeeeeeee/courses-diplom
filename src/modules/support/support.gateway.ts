import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SupportRequestsService } from './services/requests.service';
import { WsValidationCustomPipe } from 'src/pipes/ws-validation.pipe';
import { OnEvent } from '@nestjs/event-emitter';
import { SentMessageEvent } from './events/send-message.event';
import { ID } from 'src/types/common.type';
import { SendMessageDto } from './dto/send-message.dto';
import { UseFilters } from '@nestjs/common';
import { WsExceptionFilter } from 'src/exception-filters/ws-exception.filter';

@UseFilters(WsExceptionFilter)
@WebSocketGateway({ cors: true })
export class SupportGateway {
  @WebSocketServer() private server: Server;

  constructor(private readonly requestsService: SupportRequestsService) {}

  @SubscribeMessage('subscribeToChat')
  public handleSubscribeToChat(
    @MessageBody('supportRequestId') supportRequestId: ID,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(`support${supportRequestId}`);
  }

  @SubscribeMessage('sendMessage')
  public async handleSendMessage(
    @MessageBody(WsValidationCustomPipe) message: SendMessageDto,
  ): Promise<void> {
    await this.requestsService.sendMessage(message);
  }

  @OnEvent('send.message')
  public sendMessage(payload: SentMessageEvent): void {
    this.server
      .to(`support${payload.supportRequestId}`)
      .emit('newMessage', payload.message);
  }
}
