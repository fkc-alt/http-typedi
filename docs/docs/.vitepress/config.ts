import { defineConfig } from 'vitepress'
import { StaticSvgs } from './theme/config'
import VitePressConfig from '../vitepress.config.json'
import { Footer, Navbar, Sidebar } from './layout'

const { ALGOLIA_API_KEY, ALGOLIA_APP_ID, ALGOLIA_INDEX_NAME } = VitePressConfig

export default defineConfig({
  title: 'Http-Typedi',
  description: '前端Spring框架',
  head: [
    ['link', { rel: 'icon', href: '/http-typedi/logo.svg' }],
  ],
  base: '/http-typedi/',
  themeConfig: {
    logo: '/logo.svg',
    search: {
      provider: 'algolia',
      options: {
        appId: ALGOLIA_APP_ID,
        apiKey: ALGOLIA_API_KEY,
        indexName: ALGOLIA_INDEX_NAME
      }
    },
    editLink: {
      pattern: 'https://github.com/fkc-alt/http-typedi/edit/develop/docs/docs/:path',
      text: 'Edit this page on GitHub'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/fkc-alt' },
      { icon: 'twitter', link: 'https://twitter.com/kicho9931832774' },
      {
        icon: { svg: StaticSvgs.JueJin },
        link: 'https://juejin.cn/user/3664052806516327'
      }
    ],
    nav: Navbar,
    sidebar: Sidebar,
    footer: Footer
  },
})
