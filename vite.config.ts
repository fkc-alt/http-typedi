import { resolve } from 'path'
import { PluginOption, defineConfig } from 'vite'
import Dts from 'vite-plugin-dts'
import { terser as Terser } from 'rollup-plugin-terser'
import Swc from 'unplugin-swc'
export default defineConfig({
  plugins: [
    Swc.vite() as PluginOption,
    Dts({
      outputDir: 'dist/types',
      entryRoot: 'src/http-typedi'
    }),
    Terser()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~@': resolve(__dirname, './')
    },
    extensions: ['.ts', '.js', '.vue', '.json', '.d.ts', '.tsx']
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/http-typedi/index.ts'),
      name: 'http-typedi',
      fileName: 'http-typedi'
    },
    outDir: 'dist'
  }
})
