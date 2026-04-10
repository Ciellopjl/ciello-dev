import { PrismaClient } from "@prisma/client";
import { decrypt } from "./crypto";

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Obtenção condicional:
// Só rodamos o decrypt caso o DATABASE_URL_ENCRYPTED exista. Caso contrário, caímos pro local
const getConnectionUrl = () => {
  if (process.env.DATABASE_URL_ENCRYPTED) {
    return decrypt(process.env.DATABASE_URL_ENCRYPTED);
  }
  return process.env.DATABASE_URL;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: getConnectionUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
