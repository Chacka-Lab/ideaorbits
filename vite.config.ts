import { solidStart } from '@solidjs/start/config';
import { nitroV2Plugin as nitro } from '@solidjs/vite-plugin-nitro-2';
import tailwindcss from '@tailwindcss/vite';
import { config } from 'dotenv';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  // In dev, load .env into process.env so server-side code can access it via
  // process.env. In production, env vars are injected externally — dotenv is
  // intentionally skipped there.
  if (mode === 'development') config();

  return {
    envPrefix: 'PUBLIC_',

    plugins: [
      solidStart(),
      nitro({
        preset: 'node_server',
        esbuild: {
          options: {
            target: 'ES2022',
          },
        },
      }),
      tailwindcss(),
    ],
  };
});
