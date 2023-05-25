import DefaultTheme from 'vitepress/theme'
import './styles/index.css'
import type { Theme } from 'vitepress'

const define = <T>(value: T): T => value
export default define<Theme>({
  ...DefaultTheme, // 此处采用了默认主题，可以替换为自定义的主题
  NotFound: DefaultTheme.NotFound,
  enhanceApp: ({ app, router, siteData }) => {
    // console.log(router);
    // console.log(siteData)
  },
})