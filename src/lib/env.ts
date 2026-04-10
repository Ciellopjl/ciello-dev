import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(), // Prisma fallback manual local
  DATABASE_URL_ENCRYPTED: z.string().optional(), // Server connection via decrypt
  ENCRYPTION_KEY: z.string().length(64).optional(), // Chave Mestra 32 bytes hex
  AUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_SECRET: z.string().min(10).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  ADMIN_EMAIL: z.string().email(),
  UPLOADTHING_SECRET: z.string().min(1).optional(),
  UPLOADTHING_APP_ID: z.string().min(1).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Checa de forma unificada para não engasgar o build com console warnings se for Next.js internal compile.
let envData;
try {
  envData = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ ERRO GRAVE: O arquivo `.env.local` contém variáveis inválidas ou faltantes.");
    console.error(error.flatten().fieldErrors);
    // Para explicitamente a alocação de processo
    process.exit(1);
  }
}

export const env = envData!;
