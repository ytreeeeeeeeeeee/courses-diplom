import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateHotelDto {
  @IsDefined()
  @IsString()
  public title: string;

  @IsOptional()
  @IsString()
  public description: string;
}
