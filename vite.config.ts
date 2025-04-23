import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['preact', 'react-dom', '@google/generative-ai'],
          candidate: ['./src/screens/Candidate/CreateResume.tsx', './src/screens/Candidate/ResumeUpload.tsx', './src/screens/Candidate/TemplateGallery.tsx'],
          recruiter: ['./src/screens/Recruiter/RecruiterPortal.tsx'],
          landing: ['./src/screens/Landing/Hero.tsx']
        }
      }
    }
  }
})
