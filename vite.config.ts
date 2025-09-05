import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // нормальный алиас на src
    },
  },
  build: {
    target: 'esnext',           // современный output
    outDir: 'build',
    sourcemap: false,           // выключить карты в проде (если не нужны)
    minify: 'esbuild',          // быстрая минификация
    cssCodeSplit: true,         // отдельные css чанки
    chunkSizeWarningLimit: 800, // предупредить раньше
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Вынесем тяжёлые либы в отдельные чанки для кеша
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('@radix-ui')) return 'radix';
            if (id.includes('react-hook-form')) return 'forms';
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
