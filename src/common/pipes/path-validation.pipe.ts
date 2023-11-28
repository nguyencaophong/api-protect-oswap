import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class PathValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query') {
      if (typeof value === 'string' && /^\/books\/\d+/.test(value.replace(/\s/g, ''))) {
        return value;
      } else {
        throw new BadRequestException('Invalid path parameter');
      }
    }
    return value;
  }
}