import { IsDateString, IsDefined } from 'class-validator';

export class MarkAsReadDto {
  @IsDefined()
  @IsDateString()
  public createdBefore: string;
}
