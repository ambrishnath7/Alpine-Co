import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'react-toastify/dist/ReactToastify.css'
import './app/layout/styles.css'
import { router } from './app/routes/Routes.tsx'
import { store } from './app/store/store.ts'

const theme = createTheme({
  palette: {
    background: { default: '#EEF3F8', paper: '#FFFFFF' },
    text: { primary: '#14213D', secondary: '#5B6B7F' },
    primary: { main: '#2563EB' },
    secondary: { main: '#06B6D4' },
    divider: '#D6E0EB',
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer position="bottom-right" hideProgressBar theme="colored" aria-label="notifications" />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
