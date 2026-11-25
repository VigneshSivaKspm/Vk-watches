const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const apiDir = path.resolve(__dirname, '..');
const localClient = path.join(apiDir, 'node_modules', '.prisma', 'client', 'index.d.ts');
const rootClient = path.join(apiDir, '..', '..', 'node_modules', '.prisma', 'client', 'index.d.ts');
const hasGeneratedClient = fs.existsSync(localClient) || fs.existsSync(rootClient);

// Always regenerate on Linux/CI (e.g., Vercel) or when the generated Prisma client is missing.
// On Windows, skip regeneration if the client already exists to avoid EPERM locks from a running dev server.
if (process.platform !== 'win32' || !hasGeneratedClient) {
  execSync('npx prisma generate', {
    cwd: apiDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
    },
  });
}
