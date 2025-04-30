import { StrictMode } from 'preact/compat';
import { render } from 'preact';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('app')!
);
