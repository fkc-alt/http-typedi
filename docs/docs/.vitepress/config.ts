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
        appId: 'F4ACRBL2B4',
        apiKey: '82cdda10225dc1e80053d5b65c56d3aa',
        indexName: 'http-typedi'
      }
    },
    nav: Navbar,
    sidebar: Sidebar,
    footer: Footer
  },
})
