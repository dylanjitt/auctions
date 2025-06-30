import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18n.ts';
import { ErrorBoundary } from 'react-error-boundary'
import { FallbackComponent } from './components/FallbackComponent.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary
        FallbackComponent={FallbackComponent}
        onReset={() => {
          // Recargar página completa
          window.location.reload();
        }}
      >
        <UserProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <App />
          </LocalizationProvider>
        </UserProvider>
      </ErrorBoundary>
    </I18nextProvider>
  </StrictMode>,
)
