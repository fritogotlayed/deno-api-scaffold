import { createRoute } from '@hono/zod-openapi';
import {
  handleCreateUser,
  handleGetUser,
  handleListUsers,
} from './controller.ts';
import { createOpenApiApp } from '../../../shared/schema-validation/create-open-api-app.ts';
import {
  CreateUserRequestSchema,
  ParamsSchema,
  UserListResponseSchema,
  UserResponseSchema,
} from './schema.ts';
import { ErrorResponseSchema } from '../../../shared/schema/error-response.ts';

const userRoutes = createOpenApiApp();

userRoutes
  .openapi(
    createRoute({
      method: 'post',
      path: '/users',
      tags: ['User'],
      middleware: [
        // TODO: any request specific middleware goes here. Think things like id converters
      ] as const,
      request: {
        body: {
          description: 'Creates a new user in the system',
          content: {
            'application/json': {
              schema: CreateUserRequestSchema,
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User created',
          content: {
            'application/json': {
              schema: UserResponseSchema,
            },
          },
        },
        400: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: ErrorResponseSchema,
            },
          },
        },
      },
    }),
    handleCreateUser,
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/users/:userId',
      tags: ['User'],
      middleware: [
        // TODO: any request specific middleware goes here. Think things like id converters
      ] as const,
      request: {
        params: ParamsSchema,
      },
      responses: {
        200: {
          description: 'User found',
          content: {
            'application/json': {
              schema: UserResponseSchema,
            },
          },
        },
        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: ErrorResponseSchema,
            },
          },
        },
      },
    }),
    handleGetUser,
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/users',
      tags: ['User'],
      middleware: [
        // TODO: any request specific middleware goes here. Think things like id converters
      ] as const,
      responses: {
        200: {
          description: 'Users found',
          content: {
            'application/json': {
              schema: UserListResponseSchema,
            },
          },
        },
      },
    }),
    handleListUsers,
  );

export { userRoutes };
