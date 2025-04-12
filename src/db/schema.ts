// Drizzle Schema
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

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

export const membership = pgTable('membership', {
  // NOTE: There are two ways to define foreign keys. One way below if you do not
  // care about the names.
  userId: uuid('user_id').references(() => users.id).references(() => users.id)
    .notNull(),
  teamId: uuid('team_id').references(() => teams.id).references(() => teams.id)
    .notNull(),
  created: timestamp('created').notNull().defaultNow(),
  // NOTE: This is the second way to define foreign keys. This allows you to define the
  // name of the foreign key.
  // userId: uuid('user_id').notNull(),
  // teamId: uuid('team_id').notNull(),
  // }, (t) => {
  // return [
  //   foreignKey({
  //     columns: [t.userId],
  //     foreignColumns: [users.id],
  //     name: 'fk_membership_user_id',
  //   }),
  //   foreignKey({
  //     columns: [t.teamId],
  //     foreignColumns: [teams.id],
  //     name: 'fk_membership_team_id',
  //   })
  // ]
});
