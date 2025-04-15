import { Hono } from 'hono';
import { handleCreateTeam, handleGetTeam } from './controller.ts';

const teamRoutes = new Hono();

teamRoutes.post('/teams', handleCreateTeam);
teamRoutes.get('/teams/:teamId', handleGetTeam);

export { teamRoutes };
