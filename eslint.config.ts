import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import importSort from 'eslint-plugin-simple-import-sort';
import ts from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    'scripts/**',
    '.drizzle/**',
    '.nitro/**',
    '.output/**',
    '.solid-start/**',
  ]),

  ...ts.configs.recommended,

  {
    plugins: { 'simple-import-sort': importSort },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },

  prettier,
]);
