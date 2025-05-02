import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register the service worker for Google Drive image caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/drive-image-cache-worker.js')
      .then(registration => {
        console.log('Google Drive image cache service worker registered:', registration.scope);
      })
      .catch(error => {
        console.error('Error registering service worker:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
