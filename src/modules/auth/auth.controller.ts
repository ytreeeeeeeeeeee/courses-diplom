import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/local.guard';
import { IToken, IUserInfo } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @Req() req: Request & { user: IUserInfo },
  ): Promise<IToken> {
    return this.authService.login(req.user);
  }
}
