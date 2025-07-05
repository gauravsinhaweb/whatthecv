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
        manualChunks: {
          'vendor-react': ['preact', 'preact/compat'],
          'vendor-animations': ['framer-motion'],
          'vendor-ui': ['lucide-react', 'clsx', 'tailwind-merge'],
          'vendor-utils': ['axios', 'date-fns', 'js-cookie'],
          'vendor-analytics': ['@vercel/analytics'],
          'candidate': [
            './src/screens/Candidate/create/CreateResume.tsx',
            './src/screens/Candidate/analyze/ResumeUpload.tsx',
            './src/screens/Candidate/gallery/TemplateGallery.tsx',
          ],
          'recruiter': ['./src/screens/Recruiter/RecruiterPortal.tsx'],
          'landing': ['./src/screens/Landing/LandingPage.tsx'],
          'admin': ['./src/screens/Admin/AdminPage.tsx'],
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
