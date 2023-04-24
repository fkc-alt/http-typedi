import { resolve } from 'path'
import { PluginOption, defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import Swc from 'unplugin-swc'
export default defineConfig({
  plugins: [Swc.vite() as PluginOption, dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/http-typedi/index.ts'),
      name: 'http-typedi',
      fileName: 'http-typedi'
    }
  }
})
