import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/modules/users/enums/roles.enum';

export const RolesAccess = (...roles: Role[]) => SetMetadata('roles', roles);
