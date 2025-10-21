import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      tsconfigPath: './tsconfig.build.json',  // 使用专门的构建配置
      outDir: 'dist',
      copyDtsFiles: false,
      logLevel: 'warn',
      rollupTypes: true,      // 将类型定义打包成单文件
      insertTypesEntry: true  // 自动插入types入口
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DynamicForm',
      fileName: (format) => `dynamic-form.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [
        'vue', 
        'ant-design-vue', 
        'zod',
        '@ant-design/colors',
        '@ant-design/icons-vue'
      ],
      output: {
        globals: {
          vue: 'Vue',
          'ant-design-vue': 'AntDesignVue',
          zod: 'Zod',
          '@ant-design/colors': 'AntDesignColors',
          '@ant-design/icons-vue': 'AntDesignIconsVue'
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: false,     // 关闭源码映射，减少包体积
    minify: 'terser',     // 使用terser进行更好的压缩
    target: 'es2015',     // 兼容性目标
    emptyOutDir: true     // 构建前清空输出目录
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})