import { resolve } from 'path'
import { defineConfig } from 'vite'
import Dts from 'vite-plugin-dts'
import { terser as Terser } from 'rollup-plugin-terser'
import Swc from 'unplugin-swc'
import { viteMockServe as ViteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ command }) => {
  return {
    plugins: [
      Swc.vite(),
      Dts({
        outputDir: 'dist/types',
        entryRoot: 'packages/http-typedi'
      }),
      Terser(),
      ViteMockServe({
        mockPath: 'mock',
        enable: command === 'serve',
        logger: true
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'packages'),
        '~@': resolve(__dirname, './')
      },
      extensions: ['.ts', '.js', '.json', '.d.ts']
    },
    build: {
      lib: {
        entry: resolve(__dirname, './packages/http-typedi/index.ts'),
        name: 'http-typedi',
        fileName: 'http-typedi'
      },
      outDir: 'dist'
    }
  }
})
