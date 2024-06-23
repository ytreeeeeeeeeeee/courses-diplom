import { Role } from 'src/modules/users/enums/roles.enum';
import { ID } from 'src/types/common.type';

export interface IToken {
  accessToken: string;
}

export interface IUserInfo {
  id: ID;
  role: Role;
}
