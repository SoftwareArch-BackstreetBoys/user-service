import * as schema from '../drizzle/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type DrizzeDB = NodePgDatabase<typeof schema>;
