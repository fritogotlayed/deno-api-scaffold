import { createRoute } from '@hono/zod-openapi';
import { handleAddressCreate, handleAddressGet } from './controller.ts';
import { createOpenApiApp } from '../../shared/schema-validation/create-open-api-app.ts';
import { ErrorResponseSchema } from '../../shared/schema/error-response.ts';
import {
  AddressResponseSchema,
  CreateAddressRequestSchema,
  ParamsSchema,
} from './schema.ts';

const addressRoutes = createOpenApiApp();

addressRoutes
  .openapi(
    createRoute({
      method: 'post',
      path: '/addresses',
      tags: ['Address'],
      middleware: [
        // TODO: any request specific middleware goes here. Think things like id converters
      ] as const,
      request: {
        body: {
          description: 'Creates a new address in the system',
          content: {
            'application/json': {
              schema: CreateAddressRequestSchema,
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Address created',
          content: {
            'application/json': {
              schema: AddressResponseSchema,
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
    handleAddressCreate,
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/addresses/:addressId',
      tags: ['Address'],
      middleware: [
        // TODO: any request specific middleware goes here. Think things like id converters
      ] as const,
      request: {
        params: ParamsSchema,
      },
      responses: {
        200: {
          description: 'Address found',
          content: {
            'application/json': {
              schema: AddressResponseSchema,
            },
          },
        },
        404: {
          description: 'Address not found',
          content: {
            'application/json': {
              schema: ErrorResponseSchema,
            },
          },
        },
      },
    }),
    handleAddressGet,
  );

export { addressRoutes };
