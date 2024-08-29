import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, '/api'), // This line helps Vite correctly handle the path
      },
    },
  },
});

/*
Wre added this line to make post request for signup 1 hr :58 min
server:{
    proxy:{
      '/api':{
        target:'http://localhost:3000',
        secure:false
      },
    },
  },

*/