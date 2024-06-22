import process from 'node:process';
import { ZodError, z } from 'zod';
import '@/env-config';

const configSchema = z.object({
  PORT: z
    .string()
    .regex(/^\d{4,5}$/)
    .optional()
    .default('3000'),
  API_BASE_URL: z.string().url().default('/'),
  DB_URL: z
    .string()
    .url()
    .refine(
      url => url.startsWith('postgres://') || url.startsWith('postgresql://'),
      'DB_URL must be a valid postgresql url',
    ),
  JWT_SECRET: z.string(),
  RPC_URL: z.string(),
  REDIS_URL: z.string(),
});

try {
  configSchema.parse(process.env);
}
catch (error) {
  if (error instanceof ZodError)
    console.error(error.errors);

  process.exit(1);
}

export type Env = z.infer<typeof configSchema>;
