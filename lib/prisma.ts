import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = process.env.DATABASE_URL!;
console.log("DB URL loaded:", !!connectionString);
const pool = new Pool({
  connectionString: connectionString,
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
});
const adapter = new PrismaPg(pool as unknown as ConstructorParameters<typeof PrismaPg>[0]);
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
  });

globalForPrisma.prisma = prisma;
