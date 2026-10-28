import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

// Progressive Web App: register the service worker so the portal can be installed
// on Android/iOS/desktop and keeps working when the network drops.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .catch((error) => console.warn('Service worker registration skipped:', error?.message));
  });
}
