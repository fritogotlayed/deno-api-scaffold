// Entry Point
import 'jsr:@std/dotenv/load';
import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';
import { userRoutes } from './features/user/routes.ts';
import { teamRoutes } from './features/team/routes.ts';

const app = new Hono();

app.route('/users', userRoutes);
app.route('/teams', teamRoutes);

console.log(showRoutes(app));

Deno.serve(app.fetch);
