import { ID } from 'src/types/common.type';
import { Role } from '../enums/roles.enum';

export interface IUser {
  id: ID;
  email: string;
  name: string;
  contactPhone: string;
  role: Role;
}
