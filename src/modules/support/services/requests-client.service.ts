import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ICreateSupportRequestDto,
  ISupportRequestClientService,
  IMarkMessagesAsReadDto,
} from '../interfaces/support.interface';
import { ID } from 'src/types/common.type';
import { SupportRequest } from '../schemas/support-request.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schema';
import { ISupportReqeustSchema } from '../interfaces/schemas.interface';

@Injectable()
export class SupportRequestsClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<ISupportReqeustSchema>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  public async createSupportRequest(
    data: ICreateSupportRequestDto,
  ): Promise<ISupportReqeustSchema> {
    const newMessage = await this.messageModel.create({
      author: data.user,
      text: data.text,
    });

    return this.supportRequestModel.create({
      user: data.user,
      messages: [newMessage],
    });
  }

  public async markMessagesAsRead(
    params: IMarkMessagesAsReadDto,
  ): Promise<void> {
    const request = await this.supportRequestModel
      .findById(params.supportRequest)
      .populate({ path: 'messages', model: Message.name });

    if (!request) {
      throw new NotFoundException(
        `Заявки с id ${params.supportRequest} не существует`,
      );
    }

    request.messages.forEach(async (message) => {
      if (
        !message.readAt &&
        message.author.id !== params.user &&
        message.sentAt <= params.createdBefore
      ) {
        await message.updateOne({ readAt: new Date() });
      }
    });
  }

  public async getUnreadCount(supportRequest: ID): Promise<number> {
    const request = await this.supportRequestModel.findById(supportRequest);

    if (!request) {
      throw new NotFoundException(
        `Заявки с id ${supportRequest} не существует`,
      );
    }

    return request.messages.length;
  }
}
