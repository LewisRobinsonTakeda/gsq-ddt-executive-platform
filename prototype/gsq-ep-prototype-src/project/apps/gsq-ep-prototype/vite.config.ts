import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { propagateQueryPlugin } from './plugins/vite-plugin-propagate-query';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    propagateQueryPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    write: process.env.VITE_CHECK_MODE !== 'true',
    rollupOptions: {
      output: {
        // https://rollupjs.org/configuration-options/#output-inlinedynamicimports
        // will inline dynamic imports instead of creating new chunks to create a single bundle
        inlineDynamicImports: true,
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: false,
    },
  },
  optimizeDeps: {
    include: [
      '@hookform/resolvers',
      '@hookform/resolvers/zod',
      '@microsoft/power-apps/data',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      '@tanstack/react-table',
      'class-variance-authority',
      'clsx',
      'date-fns',
      'lucide-react',
      'motion',
      'react-day-picker',
      'react-dom/client',
      'react-hook-form',
      'recharts',
      'tailwind-merge',
      'uuid',
      'zod',
    ],
  },
});
