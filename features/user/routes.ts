import { Hono } from '../../deps.ts';
import { handleCreateUser, handleGetUser } from './controller.ts';

export const userRoutes = new Hono();

userRoutes.post('/', handleCreateUser);
userRoutes.get('/:id', handleGetUser);
