import { resolve } from 'path'
import { PluginOption, defineConfig, loadEnv } from 'vite'
import Dts from 'vite-plugin-dts'
import { terser as Terser } from 'rollup-plugin-terser'
import Swc from 'unplugin-swc'
import { viteMockServe as ViteMockServe } from 'vite-plugin-mock'
import { createHtmlPlugin as CreateHtmlPlugin } from 'vite-plugin-html'
import { generateTags } from './plugins/injectHTML'

export default defineConfig(({ command, mode }) => {
  const { VITE_APP_PROJECT_ICON, VITE_APP_PROJECT_TITLE } = loadEnv(
    mode,
    process.cwd()
  )
  return {
    plugins: [
      Swc.vite(),
      Dts({
        outputDir: 'dist/types',
        entryRoot: 'packages'
      }),
      Terser(),
      ViteMockServe({
        mockPath: 'mock',
        enable: command === 'serve',
        watchFiles: false,
        logger: true
      }),
      command === 'serve'
        ? CreateHtmlPlugin({
            minify: true,
            entry: '/examples/main.ts',
            template: 'index.html',
            inject: {
              tags: generateTags({
                icon: VITE_APP_PROJECT_ICON,
                title: VITE_APP_PROJECT_TITLE,
                doctype: '<!DOCTYPE html>'
              })
            }
          })
        : null
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'packages'),
        '~@': resolve(__dirname, './')
      },
      extensions: ['.ts', '.js', '.json', '.d.ts']
    },
    build: {
      // rollupOptions: {
      //   exclude: ['docs/**']
      // },
      lib: {
        entry: resolve(__dirname, './packages/index.ts'),
        name: 'http-typedi',
        fileName: 'http-typedi'
      },
      outDir: 'dist'
    }
  }
})
