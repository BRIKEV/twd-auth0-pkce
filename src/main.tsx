import { StrictMode } from 'react'
import { RouterProvider } from 'react-router'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import { router } from './routes'

// Only load the test sidebar and tests in development mode
if (import.meta.env.DEV) {
  const { initTWD } = await import('twd-js/bundled');
  const tests = import.meta.glob("./**/*.twd.test.ts");
  
  // Initialize TWD with tests and optional configuration
  // Request mocking is automatically initialized by default
  initTWD(tests, { 
    open: false, 
    position: 'left',
    serviceWorker: true,           // Enable request mocking (default: true)
    serviceWorkerUrl: '/mock-sw.js' // Custom service worker path (default: '/mock-sw.js')
  });
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
    >
      <RouterProvider router={router} />,
    </Auth0Provider>
  </StrictMode>,
)
