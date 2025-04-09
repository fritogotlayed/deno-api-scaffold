// Drizzle Schema
import { sqliteTable, text } from '../deps.ts';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
});
