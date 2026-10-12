import { Outlet, ScrollRestoration } from "react-router-dom"
import Container from "@mui/material/Container"
import Navbar from "./Navbar"
import Box from "@mui/material/Box"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { useAppSelector } from "../store/store"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  const darkMode = useAppSelector(state => state.ui.darkMode)

  const paletteType = darkMode ? 'dark' : 'light'

  const theme = createTheme({
    palette: {
      mode: paletteType,
      primary: { main: '#2563EB' },
      secondary: { main: '#06B6D4' },
      background: {
        default: paletteType === 'light' ? '#EEF3F8' : '#121212',
        paper: paletteType === 'light' ? '#FFFFFF' : '#1b2430',
      },
      ...(paletteType === 'light' && {
        text: { primary: '#14213D', secondary: '#5B6B7F' },
        divider: '#D6E0EB',
      }),
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScrollRestoration />
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          background: paletteType === 'dark'
            ? 'radial-gradient(circle, #1e3aba, #111b27)'
            : 'linear-gradient(180deg, #E3EDF7 0%, #EEF3F8 40%, #F7FAFC 100%)',
          py: 6
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 8 }}>
          <Outlet />
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
