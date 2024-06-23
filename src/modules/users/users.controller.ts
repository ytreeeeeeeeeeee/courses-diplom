import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ValidationCustomPipe } from 'src/pipes/validation.pipe';
import { CreateUserDto } from './dto/create.dto';
import { UsersService } from './users.service';
import { IUser } from './interfaces/response.interface';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesAccess } from 'src/decorators/roles.decorator';
import { Role } from './enums/roles.enum';
import { SearchUserParams } from './interfaces/users.interface';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('client/register')
  public async registerClient(
    @Body(ValidationCustomPipe) data: CreateUserDto,
  ): Promise<IUser> {
    const user = await this.usersService.create({ role: Role.CLIENT, ...data });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      contactPhone: user.contactPhone,
      role: user.role,
    };
  }

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.ADMIN)
  @Post('admin/users')
  public async createUser(
    @Body(ValidationCustomPipe) data: CreateUserDto,
  ): Promise<IUser> {
    const user = await this.usersService.create({
      role: data.role ?? Role.CLIENT,
      ...data,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      contactPhone: user.contactPhone,
      role: user.role,
    };
  }

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.ADMIN)
  @Get('admin/users')
  public async getUsersListByAdmin(
    @Query(ValidationCustomPipe) params: SearchUserParams,
  ): Promise<IUser[]> {
    const users = await this.usersService.findAll(params);

    return users.map<IUser>((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        contactPhone: user.contactPhone,
        role: user.role,
      };
    });
  }

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAccess(Role.MANAGER)
  @Get('manager/users')
  public async getUsersListByManager(
    @Query(ValidationCustomPipe) params: SearchUserParams,
  ): Promise<IUser[]> {
    const users = await this.usersService.findAll(params);

    return users.map<IUser>((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        contactPhone: user.contactPhone,
        role: user.role,
      };
    });
  }
}
