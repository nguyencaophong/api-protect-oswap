import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PathValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query') {
      if (value && value.startsWith('/books/')) {
        return value;
      } else {
        throw new BadRequestException('Invalid path parameter');
      }
    }
    return value;
  }
}