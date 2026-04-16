import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppToaster } from '@/components/AppToaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { TOOLTIP_DELAY_DURATION_MS } from '@/constants/ui'
import { SettingsProvider } from '@/providers/SettingsProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import App from './App.tsx'
import './index.css'

const ROOT_ELEMENT_ID = 'root'

const rootElement = document.getElementById(ROOT_ELEMENT_ID)
if (!rootElement) {
  throw new Error(`Root element #${ROOT_ELEMENT_ID} not found`)
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <SettingsProvider>
        <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION_MS}>
          <App />
          <AppToaster />
        </TooltipProvider>
      </SettingsProvider>
    </ThemeProvider>
  </StrictMode>,
)
