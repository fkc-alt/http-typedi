/* eslint-disable @typescript-eslint/no-unused-vars */
import Mock from 'mockjs'
import { MockMethod, Recordable } from 'vite-plugin-mock'
import { create } from './utils'

const MockList: MockMethod[] = [
  {
    url: '/rsapi/user/login',
    method: 'post',
    response: (req: Recordable): Services.Common.Response<Service.LoginRes> => {
      let code = 200
      let message = '成功'
      if (
        req.body?.username !== 'system' ||
        req.body?.password !== '12345678'
      ) {
        code = -1
        message = '用户名或密码不正确'
      }
      return {
        code,
        message,
        data: { token: Mock.Random.string(25, 50), roles: [101, 100] }
      }
    }
  },
  {
    url: '/rsapi/user/info/{:id}/{:phone}',
    method: 'get',
    response: (
      req: Recordable
    ): Services.Common.Response<Service.UserInfoRes> => {
      return {
        code: 200,
        message: '成功',
        data: {
          name: Mock.Random.cname(),
          point: Mock.Random.integer(0, 100000),
          registerTime: Mock.Random.time()
        }
      }
    }
  },
  {
    url: '/rsapi/article/tableData',
    method: 'post',
    statusCode: 400,
    timeout: 3000,
    response: (): Services.Common.Response<Service.TableDataRes> => {
      return {
        code: 200,
        message: '成功',
        data: {
          tableList: [
            ...create<Service.TableDataRecord>(10, _item => {
              return {
                date: Mock.Random.date(),
                name: Mock.Random.cname(),
                address: Mock.Random.county()
              }
            })
          ]
        }
      }
    }
  },
  {
    url: '/rsapi/article/delete/{:currentPage}/{:pageSize}',
    method: 'delete',
    response: (): Services.Common.Response<Service.TableDataRes> => {
      return {
        code: 200,
        message: '成功',
        data: {
          tableList: [
            ...create<Service.TableDataRecord>(10, _item => {
              return {
                date: Mock.Random.date(),
                name: Mock.Random.cname(),
                address: Mock.Random.county()
              }
            })
          ]
        }
      }
    }
  },
  {
    url: '/rsapi/article/getArticleList',
    method: 'post',
    response: (): Services.Common.Response<Service.ArticleListRes> => {
      return {
        code: 200,
        message: '成功',
        data: {
          articleList: [
            ...create<Service.ArticleItem>(10, _item => {
              return {
                id: Mock.Random.integer(1, 100000),
                description: Mock.Random.csentence(),
                title: Mock.Random.ctitle(5, 20),
                content: Mock.Random.cparagraph(10, 20),
                status: Mock.Random.integer(0, 3)
              }
            })
          ]
        }
      }
    }
  },
  {
    url: '/rsapi/order/orderList',
    method: 'post',
    response: (): Services.Common.Response<Service.OrderListRes> => {
      return {
        code: 200,
        message: '成功',
        data: {
          orderList: [
            ...create<Service.OrderItem>(20, _item => {
              return {
                name: Mock.Random.cname(),
                orderId: `${Mock.Random.integer(1, 50)}${Mock.Random.string(
                  2,
                  10
                )}`,
                stock: Mock.Random.integer(1, 100),
                price: Mock.Random.integer(100, 9999)
              }
            })
          ]
        }
      }
    }
  },
  {
    url: '/rsapi/order/orderDetail',
    method: 'get',
    response: (): Services.Common.Response<Service.OrderDetailRes> => {
      return {
        code: 200,
        message: '成功',
        data: create<Service.OrderItem>(1, _item => {
          return {
            name: Mock.Random.cname(),
            orderId: `${Mock.Random.integer(1, 50)}${Mock.Random.string(
              2,
              10
            )}`,
            stock: Mock.Random.integer(1, 100),
            price: Mock.Random.integer(100, 9999)
          }
        })[0]
      }
    }
  },
  {
    url: '/rsapi/order/uploadFile',
    method: 'post',
    response: (): Services.Common.Response<Services.Common.UplaodRes> => {
      return {
        code: 200,
        message: '成功',
        data: {
          url: 'https://img1.baidu.com/it/u=3527187906,1947135853&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1676998800&t=d87261632cf4313fcab070b28a78764f'
        }
      }
    }
  },
  {
    url: '/rsapi/order/uploadBase64',
    method: 'post',
    response: (): Services.Common.Response<Services.Common.UplaodRes> => {
      return {
        code: 200,
        message: '成功',
        data: {
          url: 'https://img1.baidu.com/it/u=3527187906,1947135853&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1676998800&t=d87261632cf4313fcab070b28a78764f'
        }
      }
    }
  },
  {
    url: '/rsapi/helper/apidoc',
    method: 'post',
    response: (): Services.Common.Response<any> => {
      return {
        code: 200,
        message: '成功',
        data: {
          apiList: [
            {
              path: 'login',
              params: { username: 'String', password: 'String' }
            }
          ]
        }
      }
    }
  }
]

export default MockList
