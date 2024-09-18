import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/holbertonschool-web_react/task_4/dashboard",
  plugins: [react()],
})
