import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import * as path from 'path';

// https://vitejs.dev/config/
export default ({mode, isSsrBuild}) => {
  return defineConfig({
    plugins: [
      vue(),
      vueJsx(),
    ],
    build: {
      rollupOptions: {
        input: {
          // 这里配成两个入口
          index: path.resolve(__dirname, './index.html'),
          ssr: path.resolve(__dirname, './ssr.html')
        },
        output: {
          entryFileNames: isSsrBuild ? '[name].js' : 'assets/js/[name].[hash].js',
          chunkFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: 'assets/[ext]/[name].[hash].[ext]'
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  })
}