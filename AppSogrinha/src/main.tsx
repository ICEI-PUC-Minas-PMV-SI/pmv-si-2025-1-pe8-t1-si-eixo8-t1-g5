import React from 'react'
import ReactDOM from 'react-dom/client'
import App from 'Components/App'
import './index.css'
import { firstRun } from './Utilities/theme'

// Adicionar tratamento global de erros
window.addEventListener('error', (event) => {
  console.error('Error caught by global handler:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const themeSetter = (e: Event) => {
  try {
    firstRun()
  } catch (error) {
    console.error('Error in theme initialization:', error);
  }
  window.removeEventListener('DOMContentLoaded', themeSetter)
}

window.addEventListener('DOMContentLoaded', themeSetter)

try {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Error in React rendering:', error);
  // Renderizar mensagem de erro na tela
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red;">
        <h2>Error initializing application</h2>
        <pre>${error instanceof Error ? error.message : String(error)}</pre>
        <p>Please check the console for more details.</p>
      </div>
    `;
  }
}
