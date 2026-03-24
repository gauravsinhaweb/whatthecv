import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
    }
  },
  server: {
    port: 3000,
    open: true,
    middlewareMode: false,
  },
  preview: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('preact')) return 'vendor-react'
            if (id.includes('framer-motion')) return 'vendor-animations'
            if (id.includes('lucide-react') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-ui'
            }
            if (id.includes('axios') || id.includes('date-fns') || id.includes('js-cookie')) {
              return 'vendor-utils'
            }
            if (id.includes('@vercel/analytics')) return 'vendor-analytics'
            if (id.includes('lottie')) return 'vendor-lottie'
            if (id.includes('@supabase')) return 'vendor-supabase'
            if (id.includes('@tanstack')) return 'vendor-query'
            if (id.includes('react-router')) return 'vendor-router'
            if (id.includes('zustand')) return 'vendor-zustand'
            if (id.includes('dompurify')) return 'vendor-dompurify'
            return 'vendor-misc'
          }
          if (id.includes('ResumePreview.tsx')) return 'resume-preview'
          if (id.includes('AnalysisDashboard.tsx')) return 'analysis-dashboard'
        },
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : '[name]';
          return `js/${name}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) {
            return 'assets/[name]-[hash][extname]';
          }
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/mp4|webm|ogg/i.test(ext)) {
            return `assets/videos/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      }
    }
  },
  optimizeDeps: {
    include: [
      'pdfjs-dist',
      'framer-motion',
      'lucide-react',
      'preact',
      'preact/compat'
    ],
    exclude: ['@react-pdf/renderer']
  },
  assetsInclude: ['**/*.worker.js', '**/*.worker.min.js'],
  css: {
    devSourcemap: false
  }
})
