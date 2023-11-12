import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerMethod } from '../types';
import { OrdersController } from 'src/orders/orders.controller';

export const docOrderService: SwaggerMethod<OrdersController> = {
  create: (summary: string) => {
    return applyDecorators(
      ApiOperation({ summary }),
      ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Created book price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
      }),
      ApiBearerAuth(),
    );
  },

  findAll: (summary: string) => {
    return applyDecorators(
      ApiOperation({ summary }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Get book price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found book price',
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
      }),
      ApiBearerAuth(),
    );
  },

  findOne: (summary: string) => {
    return applyDecorators(
      ApiOperation({ summary }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Read book price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found book price',
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
      }),
      ApiBearerAuth(),
    );
  },

  remove: (summary: string) => {
    return applyDecorators(
      ApiOperation({ summary }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Delete book price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found book price',
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
      }),
      ApiBearerAuth(),
    );
  },

  update: (summary: string) => {
    return applyDecorators(
      ApiOperation({ summary }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Delete book price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found book price',
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
      }),
      ApiBearerAuth(),
    );
  },
};
