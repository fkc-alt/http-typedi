import { DefaultTheme } from 'vitepress'

export const Navbar: DefaultTheme.NavItem[] = [
  {
    text: '首页',
    link: '/'
  },
  {
    text: '介绍',
    items: [
      {
        text: '为什么选择Http-Typedi',
        activeMatch: '^/guide/introduction/why-choose-http-tyedi',
        link: '/guide/introduction/why-choose-http-tyedi'
      },
      {
        text: '特性',
        activeMatch: '^/guide/introduction/features',
        link: '/guide/introduction/features'
      },
      {
        text: '致谢',
        activeMatch: '^/guide/introduction/thank',
        link: '/guide/introduction/thank'
      },
      {
        text: 'license',
        activeMatch: '^/guide/introduction/license',
        link: '/guide/introduction/license'
      }
    ]
  },
  {
    text: '起步',
    items: [
      {
        text: '安装',
        activeMatch: '^/guide/getting-started/installation',
        link: '/guide/getting-started/installation'
      },
      {
        text: '开发规范',
        activeMatch: '^/guide/getting-started/specification',
        link: '/guide/getting-started/specification'
      }
    ]
  },
  {
    text: '文档',
    items: [
      {
        text: '控制器',
        activeMatch: '^/guide/controller',
        link: '/guide/controller/'
      },
      {
        text: '提供者',
        activeMatch: '^/guide/provider',
        link: '/guide/provider/'
      },
      {
        text: '模块',
        activeMatch: '^/guide/module',
        link: '/guide/module/'
      },
      {
        text: '中间件',
        activeMatch: '^/guide/middleware',
        link: '/guide/middleware/'
      },
      {
        text: '管道',
        activeMatch: '^/guide/pipe',
        link: '/guide/pipe/'
      },
      {
        text: '内置装饰器',
        activeMatch: '^/guide/decorators',
        link: '/guide/decorators/param-decorators'
      },
      {
        text: '内置拦截器',
        activeMatch: '^/guide/interceptor',
        link: '/guide/interceptor/'
      },
      {
        text: '异常处理器',
        activeMatch: '^/guide/catch',
        link: '/guide/catch/'
      },
      {
        text: 'DTO',
        activeMatch: '^/guide/support',
        link: '/guide/support/what-is-dto'
      },
      {
        text: '全局配置',
        activeMatch: '^/guide/global-config',
        link: '/guide/global-config/'
      }
    ]
  },
  {
    text: '关于我',
    activeMatch: '^/about',
    link: '/about'
  },
  { text: '🔗 Github', link: 'https://github.com/fkc-alt/http-typedi' }
]
