import { IsOptional, IsString } from 'class-validator';
import { IUpdateHotelParams } from '../interfaces/hotels.interface';

export class UpdateHotelDto implements IUpdateHotelParams {
  @IsOptional()
  @IsString()
  public title: string;

  @IsOptional()
  @IsString()
  public description: string;
}
