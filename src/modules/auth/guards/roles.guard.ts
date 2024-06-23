import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/modules/users/enums/roles.enum';
import { IUserInfo } from '../interfaces/auth.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const user: IUserInfo = context.switchToHttp().getRequest().user;
    const hasRole = roles.some((role) => user && user.role === role);

    if (!hasRole) {
      throw new ForbiddenException('Недостаточно прав');
    }

    return true;
  }
}
