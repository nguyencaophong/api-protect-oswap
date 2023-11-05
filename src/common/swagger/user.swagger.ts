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
        description: 'Created user price success',
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
        description: 'Get user price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found user price',
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
        description: 'Update user price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found user price',
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
        description: 'Delete user price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found user price',
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
      }),
    );
  },

  readMYself: (summary: string) => {
    return applyDecorators(
      ApiOperation({ summary }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Delete user price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found user price',
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
      }),
    );
  },

  updateMyself: (summary: string) => {
    return applyDecorators(
      ApiOperation({ summary }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Delete user price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found user price',
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
        description: 'Delete user price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found user price',
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
      }),
    );
  },
};
