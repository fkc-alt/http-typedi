import { defineConfig } from 'vitepress'
import { Footer, Navbar, Sidebar } from './layout'

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
        appId: 'NJZLEWX5A7',
        apiKey: '8993cc96e4174a28e3fb9b0c55ead670',
        indexName: 'htto-typedi'
      }
    },
    nav: Navbar,
    sidebar: Sidebar,
    footer: Footer
  },
})
