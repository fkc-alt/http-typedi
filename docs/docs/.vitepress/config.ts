import { defineConfig } from 'vitepress'
import { Footer, Navbar, Sidebar } from './layout'

export default defineConfig({
  title: 'Http-Typedi',
  description: '前端Spring框架',
  themeConfig: {
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
  }
})
