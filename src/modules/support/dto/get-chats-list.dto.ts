import { IsBoolean, IsNumberString, IsOptional } from 'class-validator';

export class GetChatListParamsDto {
  @IsOptional()
  @IsNumberString()
  public offset: number;

  @IsOptional()
  @IsNumberString()
  public limit: number;

  @IsOptional()
  @IsBoolean()
  public isActive: boolean;
}
