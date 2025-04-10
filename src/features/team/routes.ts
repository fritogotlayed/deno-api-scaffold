import { Hono } from 'hono';
import { handleCreateTeam, handleGetTeam } from './controller.ts';

const teamRoutes = new Hono();

teamRoutes.post('/', handleCreateTeam);
teamRoutes.get('/:id', handleGetTeam);

export { teamRoutes };
