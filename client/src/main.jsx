import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import{ BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import {AppProvider } from './context/AppContext.jsx' 

const PUBLISHABLE_KEY = import.meta.env.VITE_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.error('Error: VITE_PUBLISHABLE_KEY is not defined in the environment variables.')
}


createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
    
      <AppProvider>
        <App />
      </AppProvider>

    </BrowserRouter>
  </ClerkProvider>
)
