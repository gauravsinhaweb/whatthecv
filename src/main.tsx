import { StrictMode } from 'preact/compat';
import { render } from 'preact';
import App from './App.tsx';
import './index.css';

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('app')!
);
