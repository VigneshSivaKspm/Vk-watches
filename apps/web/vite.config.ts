import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

/** Points the built sitemap.xml and robots.txt at the live website address. */
function seoSiteUrl(siteUrl?: string): Plugin {
  let outDir = '';
  return {
    name: 'vk-seo-site-url',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const robots = path.join(outDir, 'robots.txt');
      if (!siteUrl || !fs.existsSync(robots)) return;

      const target = new URL(/^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`).origin;
      const current = fs.readFileSync(robots, 'utf8').match(/^Sitemap:\s*(\S+)\/sitemap\.xml\s*$/m)?.[1];
      if (!current || current === target) return;

      for (const name of ['robots.txt', 'sitemap.xml']) {
        const file = path.join(outDir, name);
        if (fs.existsSync(file)) {
          fs.writeFileSync(file, fs.readFileSync(file, 'utf8').split(current).join(target));
        }
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  // The domain lives in site.config.json; a SITE_URL variable overrides it
  const site = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'site.config.json'), 'utf8'));
  const env = loadEnv(mode, __dirname, 'SITE_URL');

  return {
    plugins: [react(), seoSiteUrl(env.SITE_URL || site.siteUrl)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@vk-time/shared': path.resolve(__dirname, '../../packages/shared/src'),
      },
    },
    build: {
      target: 'es2020',
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          // Long-lived vendor chunks cache across deploys
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
          },
        },
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
  };
});
