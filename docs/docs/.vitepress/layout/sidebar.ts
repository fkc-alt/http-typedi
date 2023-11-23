import { DefaultTheme } from 'vitepress'

export const Sidebar: DefaultTheme.Sidebar = {
  '/guide/': [
    {
      text: '介绍',
      collapsed: false,
      items: [
        {
          text: '为什么选择Http-Typedi',
          link: '/guide/introduction/why-choose-http-tyedi'
        },
        {
          text: '特性',
          link: '/guide/introduction/features'
        },
        {
          text: '致谢',
          link: '/guide/introduction/thank'
        },
        {
          text: 'License',
          link: '/guide/introduction/license'
        }
      ]
    },
    {
      text: '起步',
      collapsed: false,
      items: [
        {
          text: '安装',
          link: '/guide/getting-started/installation'
        },
        {
          text: '开发规范',
          link: '/guide/getting-started/specification'
        }
      ]
    },
    {
      text: '文档',
      collapsed: false,
      items: [
        {
          text: '控制器',
          link: '/guide/controller/',
          collapsed: true,
          items: [
            {
              text: '路由',
              link: '/guide/controller/router'
            },
            {
              text: '资源',
              link: '/guide/controller/resources'
            },
            {
              text: 'Headers',
              link: '/guide/controller/headers'
            },
            {
              text: 'Version',
              link: '/guide/controller/version'
            },
            {
              text: 'Sleep',
              link: '/guide/controller/sleep'
            },
            {
              text: '路由参数',
              link: '/guide/controller/router-parameter'
            },
            {
              text: '最后一步',
              link: '/guide/controller/last-step'
            }
          ]
        },
        {
          text: '提供者',
          collapsed: true,
          link: '/guide/provider/',
          items: [
            {
              text: '服务',
              link: '/guide/provider/service'
            },
            {
              text: '依赖注入',
              link: '/guide/provider/dependency-injection'
            },
            {
              text: '可选提供者',
              link: '/guide/provider/optional'
            },
            {
              text: '属性注入',
              link: '/guide/provider/attribute-di'
            },
            {
              text: '注册提供者',
              link: '/guide/provider/register-provider'
            }
          ]
        },
        {
          text: '模块',
          collapsed: true,
          link: '/guide/module/',
          items: [
            {
              text: '功能模块',
              link: '/guide/module/features'
            },
            {
              text: '共享模块',
              link: '/guide/module/share'
            },
            {
              text: '依赖注入',
              link: '/guide/module/dependency-injection'
            },
            {
              text: '全局模块',
              link: '/guide/module/global'
            }
          ]
        },
        {
          text: '中间件',
          link: '/guide/middleware/',
          collapsed: true,
          items: [
            {
              text: '应用中间件',
              link: '/guide/middleware/use-middleware'
            },
          ]
        },
        {
          text: '管道',
          collapsed: true,
          link: '/guide/pipe/',
          items: [
            {
              text: '内置管道',
              link: '/guide/pipe/resources'
            },
            {
              text: '绑定管道',
              link: '/guide/pipe/bind'
            },
            {
              text: '自定义管道',
              link: '/guide/pipe/custom'
            }
          ]
        },
        {
          text: '守卫',
          collapsed: true,
          link: '/guide/guard/',
          items: [
            {
              text: '授权守卫',
              link: '/guide/guard/authorize'
            },
            {
              text: '执行上下文',
              link: '/guide/guard/context'
            },
            {
              text: '基于角色认证',
              link: '/guide/guard/role-authorize'
            },
            {
              text: '绑定守卫',
              link: '/guide/guard/bind'
            },
            {
              text: '为每个处理器设置角色',
              link: '/guide/guard/set-role'
            },
            {
              text: '小结',
              link: '/guide/guard/brief'
            }
          ]
        },
        {
          text: '内置装饰器',
          collapsed: true,
          items: [
            {
              text: '参数装饰器',
              link: '/guide/decorators/param-decorators'
            },
            {
              text: '自定义参数装饰器',
              link: '/guide/decorators/custome-decorators'
            },
            {
              text: '聚合装饰器',
              link: '/guide/decorators/apply-decorators'
            },
            {
              text: 'setMetadata',
              link: '/guide/decorators/set-metadata'
            }
          ]
        },
        {
          text: '拦截器',
          collapsed: true,
          link: '/guide/interceptor/',
          items: [
            {
              text: '前置拦截器',
              link: '/guide/interceptor/use-interceptors-req'
            },
            {
              text: '后置拦截器',
              link: '/guide/interceptor/use-interceptors-res'
            }
          ]
        },
        {
          text: '异常处理器',
          link: '/guide/catch/'
        },
        {
          text: 'DTO',
          collapsed: true,
          items: [
            {
              text: '什么是DTO',
              link: '/guide/support/what-is-dto'
            },
            {
              text: '如何使用DTO',
              link: '/guide/support/dto'
            }
          ]
        },
        {
          text: '全局配置',
          link: '/guide/global-config/',
          collapsed: true,
          items: [
            {
              text: '全局路由映射',
              link: '/guide/global-config/route-reflect'
            },
            {
              text: '路由前缀',
              link: '/guide/global-config/prefix'
            },
            {
              text: '异常处理器',
              link: '/guide/global-config/catch'
            },
            {
              text: '请求拦截器',
              link: '/guide/global-config/use-interceptors'
            },
            {
              text: '请求延时器',
              link: '/guide/global-config/sleep'
            }
          ]
        }
      ]
    },
    {
      text: '关于我',
      link: '/about.html'
    }
  ],
}
