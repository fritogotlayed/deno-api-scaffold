import { createRoute } from '@hono/zod-openapi';
import { handleCreateTeam, handleGetTeam } from './controller.ts';
import { createOpenApiApp } from '../../shared/schema-validation/create-open-api-app.ts';
import { ErrorResponseSchema } from '../../shared/schema/error-response.ts';
import {
  CreateTeamRequestSchema,
  ParamsSchema,
  TeamResponseSchema,
} from './schema.ts';

const teamRoutes = createOpenApiApp();

teamRoutes
  .openapi(
    createRoute({
      method: 'post',
      path: '/teams',
      tags: ['Team'],
      middleware: [
        // TODO: any request specific middleware goes here. Think things like id converters
      ] as const,
      request: {
        body: {
          description: 'Creates a new team in the system',
          content: {
            'application/json': {
              schema: CreateTeamRequestSchema,
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Team created',
          content: {
            'application/json': {
              schema: TeamResponseSchema,
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
    handleCreateTeam,
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/teams/:teamId',
      tags: ['Team'],
      middleware: [
        // TODO: any request specific middleware goes here. Think things like id converters
      ] as const,
      request: {
        params: ParamsSchema,
      },
      responses: {
        200: {
          description: 'Team found',
          content: {
            'application/json': {
              schema: TeamResponseSchema,
            },
          },
        },
        404: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: ErrorResponseSchema,
            },
          },
        },
      },
    }),
    handleGetTeam,
  );

teamRoutes.post('/teams', handleCreateTeam);
teamRoutes.get('/teams/:teamId', handleGetTeam);

export { teamRoutes };
