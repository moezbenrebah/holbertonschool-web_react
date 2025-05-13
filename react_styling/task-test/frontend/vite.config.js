import { defineConfig } from 'vite' // Import the 'defineConfig' function from Vite
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
// Vite configuration file
export default defineConfig({
  plugins: [react()], // Enable the React plugin for Vite
})
