import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global Error Handler for "Blank Screen" debugging
window.onerror = function (message, source, lineno, colno, error) {
  const errorBox = document.createElement('div');
  errorBox.style.position = 'fixed';
  errorBox.style.top = '0';
  errorBox.style.left = '0';
  errorBox.style.width = '100%';
  errorBox.style.background = '#fee2e2';
  errorBox.style.color = '#991b1b';
  errorBox.style.padding = '20px';
  errorBox.style.zIndex = '9999';
  errorBox.style.fontFamily = 'monospace';
  errorBox.style.whiteSpace = 'pre-wrap';
  errorBox.innerHTML = `<strong>Global Error:</strong>\n${message}\nat ${source}:${lineno}:${colno}\n\n${error?.stack || ''}`;
  document.body.appendChild(errorBox);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
