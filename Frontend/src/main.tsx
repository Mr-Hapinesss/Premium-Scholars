import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastProvider } from './components/shared/Toast'
import App from './App'
import './style/global.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error(
    'Could not find #root element. Make sure index.html has <div id="root"></div>'
  )
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
)