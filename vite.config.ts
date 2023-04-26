import { resolve } from 'path'
import { PluginOption, defineConfig } from 'vite'
import Dts from 'vite-plugin-dts'
import { terser as Terser } from 'rollup-plugin-terser'
import Swc from 'unplugin-swc'
export default defineConfig({
  plugins: [Swc.vite() as PluginOption, Dts(), Terser()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/http-typedi/index.ts'),
      name: 'http-typedi',
      fileName: 'http-typedi'
    },
    outDir: 'dist'
  }
})
