import { createSlice } from "@reduxjs/toolkit"

type UiState = {
  isLoading: boolean
  darkMode: boolean
}

function getInitialDarkMode(): boolean {
  const storedDarkMode = localStorage.getItem('darkMode')
  return storedDarkMode ? JSON.parse(storedDarkMode) : true
}

const initialState: UiState = {
  isLoading: false,
  darkMode: getInitialDarkMode()
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true
    },
    stopLoading: (state) => {
      state.isLoading = false
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode))
    }
  }
})

export const { startLoading, stopLoading, toggleDarkMode } = uiSlice.actions