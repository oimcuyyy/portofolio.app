import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './context/LanguageContext'
import { SenjaProvider } from './context/SenjaContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <SenjaProvider>
        <App />
      </SenjaProvider>
    </LanguageProvider>
  </StrictMode>,
)

