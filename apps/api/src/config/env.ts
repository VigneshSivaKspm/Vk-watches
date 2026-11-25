/**
 * Loads apps/api/.env. Must be the first import of the server so that no
 * module reads process.env before the values exist.
 */
import path from 'path';
import dotenv from 'dotenv';

// Resolves to apps/api/.env from both src/ and dist/, whatever the working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (process.env.NODE_ENV === 'production') {
  const problems = [
    !process.env.DATABASE_URL && 'DATABASE_URL is missing',
    (process.env.JWT_SECRET?.length ?? 0) < 32 && 'JWT_SECRET must be at least 32 characters',
  ].filter(Boolean);
  if (problems.length) throw new Error(`Invalid environment: ${problems.join('; ')}`);
}
