import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { ISearchHotelParams } from '../interfaces/hotels.interface';

export class SearchHotelDto implements ISearchHotelParams {
  @IsOptional()
  @IsNumberString()
  public limit: number;

  @IsOptional()
  @IsNumberString()
  public offset: number;

  @IsOptional()
  @IsString()
  public title: string;
}
