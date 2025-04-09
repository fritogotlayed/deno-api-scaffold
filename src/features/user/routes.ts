import { Hono } from 'hono';
import { handleCreateUser, handleGetUser } from './controller.ts';

const userRoutes = new Hono();

userRoutes.post('/', handleCreateUser);
userRoutes.get('/:id', handleGetUser);

export { userRoutes };
