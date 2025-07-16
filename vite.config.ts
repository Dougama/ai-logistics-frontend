import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mantine: ['@mantine/core', '@mantine/hooks'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          markdown: ['react-markdown', 'remark-gfm'],
          pdf: ['react-pdf', '@react-pdf/renderer'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      '@mantine/core',
      '@mantine/hooks',
      '@tabler/icons-react'
    ],
    force: true,
  },
  server: {
    hmr: {
      overlay: false,
    },
    fs: {
      cachedChecks: false,
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
});
