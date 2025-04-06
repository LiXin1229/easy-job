import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    hmr: true, // 热模块替换（Hot Module Replacement），把它设为 true 后，当你修改代码时，开发服务器能够在不刷新整个页面的情况下更新修改的模块，从而提升开发效率
    port: 4000, // 此配置指定了开发服务器所使用的端口号
    // proxy: {
    //   "/api": { // 当请求的 URL 以 /api 开头时，就会触发代理规则
    //     // target: "http://localhost:9091", // 当请求的 URL 以 /api 开头时，请求会被转发到 http://localhost:9091 这个地址
    //     target: "http://127.0.0.1:4523",
    //     changeOrigin: true, // 修改请求头中的 Origin 字段，使其与目标地址保持一致
    //     rewrite: (path) => path.replace(/^\/api/, '') // 对请求的路径进行重写，去掉 "/api"
    //   }
    // }
  }
})
