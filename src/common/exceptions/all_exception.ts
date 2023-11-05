import {
  Catch,
  ArgumentsHost,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as fs from 'fs';
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const files = request.files;

    // ** delete files when encountering intermediate errors
    request.file &&
      fs.existsSync(request.file.path) &&
      fs.rmSync(request.file.path, { force: true });
    files?.length &&
      files.map((file) => fs.existsSync(file.path) && fs.rmSync(file.path));
    files?.length &&
      files
        .map((file) => file.destination)
        .filter(
          (destination, i, destinations) =>
            destinations.indexOf(destination) === i && /id/.test(destination),
        )
        .map(
          (destination) =>
            fs.existsSync(destination) && fs.rmdirSync(destination),
        );

    super.catch(exception, host);
  }
}
