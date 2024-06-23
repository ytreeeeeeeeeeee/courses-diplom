import { ID } from 'src/types/common.type';
import { User } from '../schemas/user.schema';

export interface SearchUserParams {
  limit: number;
  offset: number;
  email?: string;
  name?: string;
  contactPhone?: string;
}

export interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: ID): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(params: SearchUserParams): Promise<User[]>;
}
