import 'reflect-metadata'
import {
  HttpFactory,
  Logger,
  RequestMethod,
  ResponseConfig,
  UtilsService
} from '@/index'
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
  const HTTPClient = HttpFactory.create(AppModule, { expose: true })
  HTTPClient.setGlobalCatchCallback((error: any) => {
    console.log(error, 'global catch callback')
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
   <h1 id='d1'>${import.meta.env.VITE_APP_PROJECT_TITLE}</h1>
   <input type='file' />
  </div>
`
document.querySelector<HTMLDivElement>('h1')!.onclick = function () {
  console.log('onclick')
  UtilsService.jsonToExcel(
    'test.csv',
    [{ name: '冯凯超', age: 23 }],
    ['name', 'age']
  )
  // new UtilsService().DOMPrint({
  //   el: 'app'
  // })
}
document.querySelector<HTMLDivElement>('input')!.onchange = async function (
  e: any
) {
  HTTPClient.uploadService.chunkUpload(
    {
      chooseFiles: e.target.files,
      chunkSizeLimit: 1
    },
    {
      url: '/rsapi/order/uploadFile',
      method: RequestMethod.POST
    }
  )
  // const list = await UtilsService.excelToJson<{ name: string; age: string }>(
  //   e.target.files[0],
  //   ['name', 'age']
  // )
  // console.log(list, 'excelToJson')
  // new UtilsService().DOMPrint({
  //   el: 'app'
  // })
}
console.log(
  UtilsService.getSearchParams(),
  'getSearchParams',
  UtilsService.omit({ name: '123', age: 22 }, ['name'])
)
console.log('sliceByNum', UtilsService.sliceByNum([1, 2, 3, 4, 5, 6, 7, 8], 4))
