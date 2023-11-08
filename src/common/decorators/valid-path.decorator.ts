import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

export const ValidPath = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const path = request.query.path as string;

  if (!path || !path.startsWith('/books/')) {
    throw new BadRequestException('Invalid path parameter');
  }
  return path;
});