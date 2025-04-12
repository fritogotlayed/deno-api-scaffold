import { Hono } from 'hono';
import { handleCreateMembership, handleGetMembership } from './controller.ts';

const membershipRoutes = new Hono();

membershipRoutes.post('/users/:userId/teams/:teamId', handleCreateMembership);
membershipRoutes.post('/teams/:teamId/users/:userId', handleCreateMembership);
membershipRoutes.get('/users/:userId/teams/:teamId', handleGetMembership);
membershipRoutes.get('/teams/:teamId/users/:userId', handleGetMembership);

export { membershipRoutes };
