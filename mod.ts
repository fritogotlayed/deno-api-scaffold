// Entry Point
import { Hono } from 'https://deno.land/x/hono/mod.ts';
import { userRoutes } from './features/user/routes.ts';

const app = new Hono();
app.route('/users', userRoutes);

Deno.serve(app.fetch);
