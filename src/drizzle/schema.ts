import { text, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  picture: text('picture').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastLogin: timestamp('last_login').defaultNow().notNull(),
});
