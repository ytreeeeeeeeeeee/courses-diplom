import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationCustomPipe implements PipeTransform {
  public async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value;
    }

    const object = plainToInstance(metatype, value);

    const errors = await validate(object);
    if (errors.length > 0) {
      const formattedErrors: Record<string, string[]> = {};
      errors.forEach((error) => {
        formattedErrors[error.property] = Object.values(error.constraints);
      });
      throw new BadRequestException(JSON.stringify(formattedErrors));
    }

    return instanceToPlain(object, { exposeUnsetFields: false });
  }
}
