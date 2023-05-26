import { defineConfig } from 'vitepress'
import { Footer, Navbar, Sidebar } from './layout'

export default defineConfig({
  title: 'Http-Typedi',
  description: '前端Spring框架',
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    base: '/http-typedi',
    search: {
      provider: 'algolia',
      options: {
        appId: '8J64VVRP8K',
        apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
        indexName: 'vitepress'
      }
    },
    nav: Navbar,
    sidebar: Sidebar,
    footer: Footer
  },
})
