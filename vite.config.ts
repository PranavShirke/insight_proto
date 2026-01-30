import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Try to load certs if available, otherwise basic HTTP (user will see error if backend is HTTPS and frontend is HTTP)
let httpsConfig = undefined;
try {
  const keyPath = path.resolve(__dirname, 'backend/certs/key.pem');
  const certPath = path.resolve(__dirname, 'backend/certs/cert.pem');
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    httpsConfig = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    }
  }
} catch (e) {
  console.warn("Could not load certs for Vite HTTPS", e);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: httpsConfig,
    host: 'localhost',
    port: 5173
  }
})
