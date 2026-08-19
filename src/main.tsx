import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthContext'
import { HotelProvider } from './auth/HotelContext'
import { HashRouter } from 'react-router-dom'
import './index.css'
import "./i18n";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
    <AuthProvider>
    <HotelProvider>
    <App />
    </HotelProvider>
    </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})


