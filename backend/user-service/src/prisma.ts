import "dotenv/config";
import { Pool } from 'pg'; // <--- Import Pool from 'pg'
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

// 1. Create a Postgres Pool first
const pool = new Pool({ connectionString });

// 2. Pass the pool to the Adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the Client
export const prisma = new PrismaClient({ adapter });
