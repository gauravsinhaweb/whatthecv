import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils', // Optional, for testing
    }
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['preact', 'react-dom', '@google/generative-ai'],
          candidate: [
            './src/screens/Candidate/create/CreateResume.tsx',
            './src/screens/Candidate/analyze/ResumeUpload.tsx',
            './src/screens/Candidate/gallery/TemplateGallery.tsx',
          ],
          recruiter: ['./src/screens/Recruiter/RecruiterPortal.tsx'],
          landing: ['./src/screens/Landing/Hero.tsx'],
          pdfjs: ['pdfjs-dist']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  // Handle PDF.js worker files properly
  assetsInclude: ['**/*.worker.js', '**/*.worker.min.js']
})
