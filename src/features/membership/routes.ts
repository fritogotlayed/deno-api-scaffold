import { createRoute } from '@hono/zod-openapi';
import {
  handleAddTeamToUser,
  handleAddUserToTeam,
  handleGetMembership,
} from './controller.ts';
import { createOpenApiApp } from '../../shared/schema-validation/create-open-api-app.ts';
import {
  MembershipResponseSchema,
  TeamIdParamsSchema,
  UserAndTeamIdsParamsSchema,
  UserIdParamsSchema,
} from './schema.ts';
import { ErrorResponseSchema } from '../../shared/schema/error-response.ts';

// NOTE: This, and other routes, can likely be made less "wordy" by utilizing some
// helper functions to build the argument for the createRoute function.
const membershipRoutes = createOpenApiApp();

membershipRoutes
  .openapi(
    createRoute({
      method: 'post',
      path: '/users/:userId/memberships',
      tags: ['Membership'],
      middleware: [
        // TODO: any request specific middleware goes here. Think things like id converters
      ] as const,
      request: {
        params: UserIdParamsSchema,
      },
      responses: {
        201: {
          description: 'Membership created',
          content: {
            'application/json': {
              schema: MembershipResponseSchema,
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
    handleAddTeamToUser,
  )
  .openapi(
    createRoute({
      method: 'post',
      path: '/teams/:teamId/memberships',
      tags: ['Membership'],
      middleware: [
        // TODO: any request specific middleware goes here. Think things like id converters
      ] as const,
      request: {
        params: TeamIdParamsSchema,
      },
      responses: {
        201: {
          description: 'Membership created',
          content: {
            'application/json': {
              schema: MembershipResponseSchema,
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
    handleAddUserToTeam,
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/users/:userId/teams/:teamId',
      tags: ['Membership'],
      middleware: [
        // TODO: any request specific middleware goes here. Think things like id converters
      ] as const,
      request: {
        params: UserAndTeamIdsParamsSchema,
      },
      responses: {
        200: {
          description: 'Membership found',
          content: {
            'application/json': {
              schema: MembershipResponseSchema,
            },
          },
        },
        404: {
          description: 'Membership not found',
          content: {
            'application/json': {
              schema: ErrorResponseSchema,
            },
          },
        },
      },
    }),
    handleGetMembership,
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/teams/:teamId/users/:userId',
      tags: ['Membership'],
      middleware: [
        // TODO: any request specific middleware goes here. Think things like id converters
      ] as const,
      request: {
        params: UserAndTeamIdsParamsSchema,
      },
      responses: {
        200: {
          description: 'Membership found',
          content: {
            'application/json': {
              schema: MembershipResponseSchema,
            },
          },
        },
        404: {
          description: 'Membership not found',
          content: {
            'application/json': {
              schema: ErrorResponseSchema,
            },
          },
        },
      },
    }),
    handleGetMembership,
  );

export { membershipRoutes };
