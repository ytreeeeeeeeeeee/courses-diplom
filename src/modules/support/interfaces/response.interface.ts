import { IUser } from 'src/modules/users/interfaces/response.interface';
import { ID } from 'src/types/common.type';

export interface IClientSupportRequest {
  id: ID;
  createdAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
}

export interface IManagerSupportRequest {
  id: ID;
  createdAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
  client: IUser;
}

export interface IMessage {
  id: ID;
  createdAt: string;
  text: string;
  readAt: string | false;
  author: IAuthor;
}

export interface IAuthor {
  id: ID;
  name: string;
}
