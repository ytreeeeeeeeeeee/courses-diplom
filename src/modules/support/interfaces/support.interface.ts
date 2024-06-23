import { ID } from 'src/types/common.type';
import { Message } from '../schemas/message.schema';
import { SupportRequest } from '../schemas/support-request.schema';

export interface ICreateSupportRequestDto {
  user: ID;
  text: string;
}

export interface ISendMessageDto {
  author: ID;
  supportRequest: ID;
  text: string;
}
export interface IMarkMessagesAsReadDto {
  user: ID;
  supportRequest: ID;
  createdBefore: Date;
}

export interface IGetChatListParams {
  user: ID | null;
  isActive: boolean;
  limit: number;
  offset: number;
}

export interface ISupportRequestService {
  findSupportRequests(params: IGetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: ISendMessageDto): Promise<Message>;
  getMessages(supportRequest: ID): Promise<Message[]>;
}

export interface ISupportRequestClientService {
  createSupportRequest(data: ICreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: IMarkMessagesAsReadDto): Promise<void>;
  getUnreadCount(supportRequest: ID): Promise<number>;
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: IMarkMessagesAsReadDto): Promise<void>;
  getUnreadCount(supportRequest: ID): Promise<number>;
  closeRequest(supportRequest: ID): Promise<void>;
}
