import { IsDateString, IsDefined, IsMongoId } from 'class-validator';
import { ID } from 'src/types/common.type';

export class CreateReservationDto {
  @IsDefined()
  @IsMongoId()
  public roomId: ID;

  @IsDefined()
  @IsDateString()
  public dateStart: string;

  @IsDefined()
  @IsDateString()
  public dateEnd: string;
}
