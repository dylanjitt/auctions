import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <App />
  </LocalizationProvider>
    </UserProvider>  
  </StrictMode>,
)
