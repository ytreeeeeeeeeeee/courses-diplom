import { ID } from 'src/types/common.type';
import { IMessage } from '../interfaces/response.interface';
import { Message } from '../schemas/message.schema';

export class SentMessageEvent {
  private _supportRequestId: ID;
  private _message: IMessage;

  public get supportRequestId(): ID {
    return this._supportRequestId;
  }

  public get message(): IMessage {
    return this._message;
  }

  constructor(supportRequestId: ID, message: Message) {
    this._supportRequestId = supportRequestId;
    this._message = {
      id: message.id,
      createdAt: message.sentAt.toISOString(),
      text: message.text,
      readAt: message.readAt ? message.readAt.toISOString() : false,
      author: {
        id: message.author.id,
        name: message.author.name,
      },
    };
  }
}
