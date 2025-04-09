// Entry Point
import "jsr:@std/dotenv/load";
import { Hono } from 'npm:hono';
import { userRoutes } from './features/user/routes.ts';

const app = new Hono();
app.route('/users', userRoutes);

Deno.serve(app.fetch);
