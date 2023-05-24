import { DefaultTheme } from 'vitepress'

export const Navbar: DefaultTheme.NavItem[] = [
  {
    text: '首页',
    link: '/',
  },
  {
    text: '文档',
    activeMatch: '^/guide',
    link: '/guide/introduction/why-choose-http-tyedi'
  },
  { text: '🔗 Github', link: 'https://github.com/fkc-alt/http-typedi' }
]
