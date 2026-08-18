import { solidStart } from '@solidjs/start/config';
import tailwindcss from '@tailwindcss/vite';
import { config } from 'dotenv';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  // In dev, load .env into process.env so server-side code can access it via
  // process.env. In production, env vars are injected externally — dotenv is
  // intentionally skipped there.
  if (mode === 'development') config();

  return {
    envPrefix: 'PUBLIC_',

    optimizeDeps: {
      include: ['source-map-js', 'error-stack-parser', 'stackframe'],
    },

    plugins: [
      solidStart(),
      nitro({
        preset: 'node_server',
      }),
      tailwindcss(),
    ],
  };
});
