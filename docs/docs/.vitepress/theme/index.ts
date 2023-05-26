import DefaultTheme from 'vitepress/theme'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './styles/index.css'
import type { Theme } from 'vitepress'

NProgress.configure({ showSpinner: false })

const define = <T>(value: T): T => value
export default define<Theme>({
  ...DefaultTheme, // 此处采用了默认主题，可以替换为自定义的主题
  NotFound: DefaultTheme.NotFound,
  enhanceApp: ({ app, router, siteData }) => {
    router.onAfterRouteChanged = (to) => {
      NProgress.done();
    }
    router.onBeforeRouteChange = (to) => {
      NProgress.start();
    }
    // console.log(siteData)
  },
})