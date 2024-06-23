import {
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
  IsMongoId,
} from 'class-validator';
import { ID } from 'src/types/common.type';

export class UpdateHotelRoomDto {
  @IsOptional()
  @IsMongoId()
  public hotel: ID;

  @IsOptional()
  @IsString()
  public description: string;

  @IsOptional()
  @IsArray()
  public images: string[];

  @IsOptional()
  @IsBoolean()
  public isEnabled: boolean;
}
