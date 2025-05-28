import { StrictMode } from 'preact/compat';
import { render } from 'preact';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import App from './App.tsx';
import './index.css';

render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('app')!
);
