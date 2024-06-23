import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class WsValidationCustomPipe implements PipeTransform {
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
      throw new WsException(JSON.stringify(formattedErrors));
    }

    return instanceToPlain(object, { exposeUnsetFields: false });
  }
}
