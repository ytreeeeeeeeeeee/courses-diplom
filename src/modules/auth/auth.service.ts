import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IToken, IUserInfo } from './interfaces/auth.interface';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<IUserInfo> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        'Пользователь с таким email не зарегистрирован',
      );
    }

    if (!bcrypt.compareSync(password, user.passwordHash)) {
      throw new UnauthorizedException('Неверный пароль');
    }

    return { id: user.id, role: user.role };
  }

  public async login(payload: IUserInfo): Promise<IToken> {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
