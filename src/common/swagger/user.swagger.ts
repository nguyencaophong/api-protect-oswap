import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersController } from 'src/users/users.controller';
import { SwaggerMethod } from '../types';

export const docUserService: SwaggerMethod<UsersController> = {
  create: (summary: string) => {
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

  findAll: (summary: string) => {
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
    );
  },

  findOne: (summary: string) => {
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
    );
  },

  remove: (summary: string) => {
    return applyDecorators(
      ApiOperation({ summary }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Delete package price success',
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
    );
  },

  update: (summary: string) => {
    return applyDecorators(
      ApiOperation({ summary }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Delete package price success',
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
    );
  },
};
