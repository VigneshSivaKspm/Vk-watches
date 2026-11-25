import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

// On Vercel serverless functions, the deployment bundle is read-only.
// Copy the bundled SQLite snapshot into /tmp on cold start when using SQLite without an external DB URL.
if (process.env.VERCEL && (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:./'))) {
  const sourceDb = path.resolve(__dirname, '../../prisma/dev.db');
  const tmpDb = '/tmp/vk-time-dev.db';
  if (fs.existsSync(sourceDb) && !fs.existsSync(tmpDb)) {
    fs.copyFileSync(sourceDb, tmpDb);
  }
  if (fs.existsSync(tmpDb)) {
    process.env.DATABASE_URL = `file:${tmpDb}`;
  }
}

export const prisma = new PrismaClient();
