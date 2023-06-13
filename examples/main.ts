import 'reflect-metadata'
import { HttpFactory } from '@/index'
import AppModule from './app.module'
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
    const Authorization = 'this is authorization'
    if (Authorization && configure.headers)
      configure.headers.Authorization = `Bearer ${Authorization}`
    return configure
  })
  HTTPClient.useInterceptorsRes(result => {
    console.log('global InterceptorsRes', result)
    const callError = result?.status !== 200 && result?.data?.code !== 200
    console.log(callError, 'callError')
    if (!callError) return result.data
    return Promise.reject(result) // or throw result
  })
  return HTTPClient
}

const HTTPClient = createHTTPClient()

const {
  articleController: { GetTableDataList, GetArticleList }
} = HTTPClient
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
