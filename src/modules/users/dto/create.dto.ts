import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '../enums/roles.enum';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @IsEmail()
  public email: string;

  @IsDefined()
  @IsString()
  public password: string;

  @IsDefined()
  @IsString()
  public name: string;

  @IsDefined()
  @IsString()
  public contactPhone: string;

  @IsOptional()
  @IsEnum(Role)
  public role: Role;
}
