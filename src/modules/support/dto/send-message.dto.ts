import { ID } from 'src/types/common.type';
import { ISendMessageDto } from '../interfaces/support.interface';
import { IsDefined, IsMongoId, IsString } from 'class-validator';

export class SendMessageDto implements ISendMessageDto {
  @IsDefined()
  @IsMongoId()
  public author: ID;

  @IsDefined()
  @IsMongoId()
  public supportRequest: ID;

  @IsDefined()
  @IsString()
  public text: string;
}
