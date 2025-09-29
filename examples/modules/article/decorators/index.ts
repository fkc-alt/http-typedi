import {
  Catch,
  Controller,
  Header,
  PostMapping,
  UseInterceptorsReq,
  UseInterceptorsRes,
  applyDecorators,
  Sleep,
  Version,
  Timeout,
  ContentType,
  DeleteMapping
} from '@/index'
import { Route, ArticleRouteChildren } from '../..'
import { catchCallback } from '../catch/catch-callback'
import { validationErrorMessage } from '../validation/validate'

// 获取随机id
const getRandomId = () => Math.random().toString().slice(2, 8)

export const ArticleControllerApplydecorators = (): ClassDecorator => {
  return applyDecorators(
    Controller(Route.ARTICLE, { version: '' }),
    Catch(error => {
      console.log(error, 'Controller error')
    }),
    Header('Request-Route', Route.ARTICLE),
    UseInterceptorsReq(configure => {
      console.log(configure, 'Controller InterceptorsReq')
      return configure
    }),
    UseInterceptorsRes(result => {
      console.log(result, 'Controller InterceptorsRes')
      const callError = result?.status !== 200 && result?.data?.code !== 200
      if (!callError) return result.data
      return Promise.reject(result) // or throw result
    })
  )
}

export const GetArticleListApplyDecorators = () => {
  return applyDecorators(
    Catch(catchCallback),
    Header('RequestId', getRandomId),
    Header('Content-Type', ContentType.FORM_DATA),
    PostMapping(ArticleRouteChildren.GETARTICLELIST, validationErrorMessage),
    UseInterceptorsReq(
      configure => {
        configure.headers &&
          (configure.headers['Route-Path'] = 'GetArticleList')
        return configure
      },
      configure => {
        console.log(configure, 'last')
        return configure
      }
    )
  )
}

export const GetTableDataApplyDecorators = () => {
  return applyDecorators(
    Header('RequestId', getRandomId),
    Header(ArticleRouteChildren.TABLEDATA, ArticleRouteChildren.TABLEDATA),
    Catch(catchCallback),
    PostMapping(ArticleRouteChildren.TABLEDATA, validationErrorMessage),
    Sleep(3000),
    Version('')
    // Timeout(2000, (error: any) => {
    //   console.log('timeout callback', error)
    // })
  )
}

export const DeleteArticleApplyDecorators = () => {
  return applyDecorators(
    DeleteMapping('delete/:currentPage/:pageSize'),
    Header('DeleteArticle', 'delete')
  )
}
