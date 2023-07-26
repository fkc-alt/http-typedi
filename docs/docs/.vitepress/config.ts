import { defineConfig } from 'vitepress'
import AlgoliaConfig from '../algolia.config.json'
import { Footer, Navbar, Sidebar } from './layout'

const { ALGOLIA_API_KEY, ALGOLIA_APP_ID, ALGOLIA_INDEX_NAME } = AlgoliaConfig

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
    nav: Navbar,
    sidebar: Sidebar,
    footer: Footer
  },
})
