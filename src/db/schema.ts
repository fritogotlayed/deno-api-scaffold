// Drizzle Schema
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  email: text('email').notNull(),
});

export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull(),
});
