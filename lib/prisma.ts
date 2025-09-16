import { PrismaClient } from "@/prisma/generated/client";
import { attachDatabasePool } from '@vercel/functions'
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a connection pool
const connectionString = process.env.POSTGRES_URL || '';
const pool = new Pool({ connectionString });
attachDatabasePool(pool)

const adapter = new PrismaPg(pool);

// Initialize Prisma with the PostgreSQL adapter
const prismaClient = global.prisma || new PrismaClient({
  adapter: adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

// In development, set up a global instance to prevent multiple instances during hot-reloading
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

export const prisma = prismaClient;