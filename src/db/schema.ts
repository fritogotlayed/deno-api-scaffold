// Drizzle Schema
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// NOTE: Keeping the exports in here alphabetical for readability/maintainability
export const address = pgTable('address', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  hash: text('hash').notNull(),
  street1: text('street').notNull(),
  street2: text('street2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zip: text('zip').notNull(),
}, (t) => [
  index('address_hash_idx').on(t.hash),
]);

export const membership = pgTable('membership', {
  userId: uuid('user_id').references(() => users.id).references(() => users.id)
    .notNull(),
  teamId: uuid('team_id').references(() => teams.id).references(() => teams.id)
    .notNull(),
  created: timestamp('created').notNull().defaultNow(),
});

export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull(),
  addressId: uuid('address_id').references(() => address.id),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  email: text('email').notNull(),
}, (t) => [
  index('email_index').on(t.email),
]);
