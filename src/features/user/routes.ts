import { Hono } from 'hono';
import { handleCreateUser, handleGetUser } from './controller.ts';

const userRoutes = new Hono();

userRoutes.post('/users', handleCreateUser);
userRoutes.get('/users/:userId', handleGetUser);

export { userRoutes };
