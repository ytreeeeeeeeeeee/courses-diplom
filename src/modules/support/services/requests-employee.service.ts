import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ISupportRequestEmployeeService,
  IMarkMessagesAsReadDto,
} from '../interfaces/support.interface';
import { ID } from 'src/types/common.type';
import { InjectModel } from '@nestjs/mongoose';
import { SupportRequest } from '../schemas/support-request.schema';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schema';

@Injectable()
export class SupportRequestsEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<SupportRequest>,
  ) {}

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

  public async closeRequest(supportRequest: ID): Promise<void> {
    const request = await this.supportRequestModel.findById(supportRequest);

    if (!request) {
      throw new NotFoundException(
        `Заявки с id ${supportRequest} не существует`,
      );
    }

    await request.updateOne({ isActive: false });
  }
}
