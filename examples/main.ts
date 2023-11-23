import 'reflect-metadata'
import { HttpFactory, Logger, ResponseConfig } from '@/index'
import AppModule from './app.module'
import { HTTPClient2 } from './test/app.module'
import './style.css'

/**
 *
 * @module Services
 * @return { AppModule } AppModule
 * @description service for entry file
 */
function createHTTPClient(): AppModule {
  const HTTPClient = HttpFactory.create(AppModule)
  HTTPClient.setGlobalCatchCallback((error: any) => {
    console.error(error, 'global catch callback')
  })
  HTTPClient.setGlobalPrefix(import.meta.env.VITE_APP_BASE_API)
  HTTPClient.useInterceptorsReq(configure => {
    console.log(configure, 'useInterceptorsReq')
    const Authorization = 'this is authorization'
    configure.headers!.ack = true
    if (Authorization && configure.headers)
      configure.headers.Authorization = `Bearer ${Authorization}`
    return configure
  })
  HTTPClient.useInterceptorsRes(
    (result: ResponseConfig<Services.Common.Response>) => {
      console.log('global InterceptorsRes', result)
      const callError = result?.status !== 200 && result?.data?.code !== 200
      console.log(callError, 'callError')
      if (!callError) return result.data
      return Promise.reject(result) // or throw result
    }
  )
  HTTPClient.useLogger(Logger)
  return HTTPClient
}

const HTTPClient = createHTTPClient()
console.log(HTTPClient, HTTPClient2, '222222')
HTTPClient.orderController.UploadFile({ file: 123, x: 1 })
HTTPClient.userController.Login({ username: '123', password: '15732943481' })
HTTPClient2.articleController
  .GetArticleList({})
  .then(res => {
    console.log(res, 'HTTPClient2')
  })
  .catch(err => console.error(err, 'HTTPClient2 error'))
const {
  articleController: { GetTableDataList, GetArticleList, DeleteArticle }
} = HTTPClient
HTTPClient.userController.UserInfo({ id: 1, phone: '157' }).then(res => {
  console.log(res, 'UserInfo')
})
DeleteArticle({ currentPage: 1, pageSize: 10 }).then(res => {
  console.log(res, 'DeleteArticle')
})
HTTPClient.demoController
  .GetArticleList({
    currentPage: 1,
    pageSize: 10,
    channel: ['1', '2'],
    checkDemoList: [
      {
        age: 1,
        name: '11111'
      }
    ],
    content: '123123',
    param: {
      status: 1,
      text: '123121111111',
      title: '11231223'
    }
  })
  .then(res => {
    console.log(res, 'resss')
  })
GetTableDataList({
  currentPage: 1,
  pageSize: 10
}).then(res => {
  console.log(res, 'ressss')
})
GetArticleList({
  currentPage: 1,
  pageSize: 10,
  channel: ['1', '2'],
  checkDemoList: [
    {
      age: 1,
      name: '11111'
    }
  ],
  content: '123123',
  param: {
    status: 1,
    text: '123121111111',
    title: '11231223'
  }
})

console.log(HTTPClient)

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
   <h1>http-typedi</h1>
  </div>
`
