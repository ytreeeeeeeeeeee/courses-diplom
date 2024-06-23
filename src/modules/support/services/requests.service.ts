import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IGetChatListParams,
  ISupportRequestService,
  ISendMessageDto,
} from '../interfaces/support.interface';
import { ID } from 'src/types/common.type';
import { Message } from '../schemas/message.schema';
import { SupportRequest } from '../schemas/support-request.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SentMessageEvent } from '../events/send-message.event';
import { ISupportReqeustSchema } from '../interfaces/schemas.interface';

@Injectable()
export class SupportRequestsService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<ISupportReqeustSchema>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async findSupportRequests(
    params: IGetChatListParams,
  ): Promise<ISupportReqeustSchema[]> {
    const filter: any = {
      isActive: params.isActive,
    };

    if (params.user) {
      filter.user = params.user;
    }

    return this.supportRequestModel
      .find(filter)
      .skip(params.offset)
      .limit(params.limit)
      .populate('user');
  }

  public async sendMessage(data: ISendMessageDto): Promise<Message> {
    const newMessage = await this.messageModel.create({
      author: data.author,
      text: data.text,
    });

    const request = await this.supportRequestModel.findById(
      data.supportRequest,
    );

    if (!request) {
      throw new NotFoundException(
        `Заявки с id ${data.supportRequest} не существует`,
      );
    }

    request.messages.push(newMessage.id);
    await request.save();

    this.eventEmitter.emit(
      'send.message',
      new SentMessageEvent(request.id, await newMessage.populate('author')),
    );

    return newMessage.populate('author');
  }

  public async getMessages(supportRequest: ID): Promise<Message[]> {
    const request = await this.supportRequestModel
      .findById(supportRequest)
      .populate({
        path: 'messages',
        model: Message.name,
        populate: { path: 'author' },
      });

    console.log(request);

    if (!request) {
      throw new NotFoundException(
        `Заявки с id ${supportRequest} не существует`,
      );
    }

    return request.messages;
  }
}
