import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// The backend has no CORS middleware, so the dev server proxies /api and /health.
export default defineConfig({ plugins: [react()], server: { proxy: { '/api': 'http://localhost:5000', '/health': 'http://localhost:5000' } } });
