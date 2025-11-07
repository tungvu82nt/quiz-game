import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Cho phép đọc file markdown ở thư mục cha: d:\\IP\\111\\quiz-tam-ly-vui-nhon.md
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
  },
})
