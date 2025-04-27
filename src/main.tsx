import { StrictMode } from 'preact/compat';
import { render } from 'preact';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { routes } from './routes';

const router = createBrowserRouter([
  {
    path: '*',
    element: <App />
  }
]);

render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
  document.getElementById('app')!
);
