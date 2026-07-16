import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "file:./data/dungeonscribe.db";
  const adapter = new PrismaBetterSqlite3({ url });

  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as typeof globalThis & {
  dungeonScribePrisma?: PrismaClient;
};

export const prisma = globalForPrisma.dungeonScribePrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.dungeonScribePrisma = prisma;
}
