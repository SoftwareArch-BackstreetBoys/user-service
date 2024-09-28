import { text, serial, pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  picture: text('picture').notNull(),
});
