import {
  IsBoolean,
  IsDefined,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { ID } from 'src/types/common.type';

export class CreateHotelRoomDto {
  @IsDefined()
  @IsMongoId()
  public hotel: ID;

  @IsOptional()
  @IsString()
  public description: string;

  @IsOptional()
  @IsBoolean()
  public isEnabled: boolean;
}
