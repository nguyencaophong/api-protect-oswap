import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerMethod } from '../types';
import { RolesController } from 'src/roles/roles.controller';

export const docRoleService: SwaggerMethod<RolesController> = {
  create: (summary: string) => {
    return applyDecorators(
      ApiOperation({ summary }),
      ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Created category price success',
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
        description: 'Get category price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found category price',
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
        description: 'Delete category price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found category price',
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
      }),
      ApiBearerAuth(),
    );
  },

  // addBook: (summary: string) => {
  //   return applyDecorators(
  //     ApiOperation({ summary }),
  //     ApiResponse({
  //       status: HttpStatus.OK,
  //       description: 'Add book into category',
  //     }),
  //     ApiResponse({
  //       status: HttpStatus.BAD_REQUEST,
  //       description: 'Bad Request',
  //     }),
  //     ApiResponse({
  //       status: HttpStatus.NOT_FOUND,
  //       description: 'Not found category price',
  //     }),
  //     ApiResponse({
  //       status: HttpStatus.INTERNAL_SERVER_ERROR,
  //       description: 'Internal Server Error',
  //     }),
  //     ApiBearerAuth(),
  //   );
  // },

  update: (summary: string) => {
    return applyDecorators(
      ApiOperation({ summary }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Delete category price success',
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Not found category price',
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
      }),
      ApiBearerAuth(),
    );
  },
};
