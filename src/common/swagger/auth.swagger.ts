import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { SwaggerMethod } from '../types';
import { AuthController } from 'src/auth/auth.controller';

export const docAuthService: SwaggerMethod<AuthController> = {
  login: (summary: string) => {
    return applyDecorators(
      ApiOperation({ summary }),
      ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Created package price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
      }),
    );
  },

  logout: (summary: string) => {
    return applyDecorators(
      ApiOperation({ summary }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Get package price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found package price',
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
      }),
      ApiBearerAuth(),
    );
  },

  resetPassword: (summary: string) => {
    return applyDecorators(
      ApiOperation({ summary }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Update package price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found package price',
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
      }),
      ApiBearerAuth(),
    );
  },
};
