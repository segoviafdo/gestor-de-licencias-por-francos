import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno para que estén disponibles durante el build
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Esto permite que 'process.env.API_KEY' funcione en el código del cliente
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})