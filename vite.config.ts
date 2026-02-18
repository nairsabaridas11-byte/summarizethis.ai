import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // BUG FIX 7: loadEnv(mode, '.') uses a relative path '.' which resolves
    // differently depending on where Vite is invoked from (e.g. Vercel runs
    // builds from the repo root, not the project subfolder). Using process.cwd()
    // always points to the directory Vite was started from, matching where
    // .env files actually live. Both GEMINI_API_KEY and API_KEY are exposed
    // so existing code using either name continues to work.
    const env = loadEnv(mode, process.cwd(), '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
      },
    };
});
