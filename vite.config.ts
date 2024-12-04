
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    target: 'es6',
  },
  server: {
    host: true, // Use '0.0.0.0' to allow access from local network
    port: 8080, // Specify the port
  },
});
