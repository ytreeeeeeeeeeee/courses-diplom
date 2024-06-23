import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types, isValidObjectId } from 'mongoose';

@Injectable()
export class ObjectIdValiadtionPipe implements PipeTransform {
  public transform(value: any) {
    if (isValidObjectId(value)) {
      if (new Types.ObjectId(value) == value) {
        return value;
      }
    }

    throw new BadRequestException(`${value} не является валидным id`);
  }
}
