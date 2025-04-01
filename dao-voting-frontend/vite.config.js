import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'bd9d-27-109-9-122.ngrok-free.app', // Add your Ngrok domain here
    ],
    proxy: {
      // Example: If your backend is running on localhost:3030, you can forward requests
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional, for path rewriting
      },
    },
    cors: true, // Enable CORS for all origins by default
  },
});
