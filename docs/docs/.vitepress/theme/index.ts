import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import 'nprogress/nprogress.css'
import './styles/index.css'

const define = <T>(value: T): T => value

export default define<Theme>({
  ...DefaultTheme, // 此处采用了默认主题，可以替换为自定义的主题
  NotFound: DefaultTheme.NotFound,
  enhanceApp: ({ app, router, siteData }) => {
    import('nprogress').then((m) => {
      // app.use(m.default);
      const NProgress = m.default
      NProgress.configure({ showSpinner: false })
      router.onAfterRouteChanged = (to) => {
        NProgress.done();
      }
      router.onBeforeRouteChange = (to) => {
        NProgress.start();
      }
    });
    // console.log(siteData)
  },
})
