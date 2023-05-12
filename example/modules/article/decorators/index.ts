import ContentTypeService from '../../../common/providers/contentType.service'
import {
  Catch,
  Controller,
  Header,
  Post,
  UseInterceptorsReq,
  UseInterceptorsRes,
  applyDecorators,
  Sleep
} from '@/http-typedi'
import { Route, ArticleRouteChildren } from '../..'
import { catchCallback } from '../catch/catch-callback'
import { validationErrorMessage } from '../validation/validate'

// 获取随机id
const getRandomId = () => Math.random().toString().slice(2, 8)

export const ArticleControllerApplydecorators = (): ClassDecorator => {
  return applyDecorators(
    Controller(Route.ARTICLE),
    Catch(error => {
      console.log(error, 'Controller')
    }),
    Header('Request-Route', Route.ARTICLE),
    UseInterceptorsReq(configure => {
      console.log(configure, 'Controller InterceptorsReq')
      return configure
    }),
    UseInterceptorsRes(result => {
      console.log(result, 'Controller InterceptorsRes')
      const callError = result?.status !== 200 || result?.data?.code !== 200
      if (!callError) return result.data
      return Promise.reject(result) // or throw result
    })
  )
}

export const GetArticleListApplyDecorators = () => {
  return applyDecorators(
    Catch(catchCallback),
    Header('RequestId', getRandomId),
    Header('Content-Type', ContentTypeService.JSON),
    Post(ArticleRouteChildren.GETARTICLELIST, validationErrorMessage),
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
    Post(ArticleRouteChildren.TABLEDATA, validationErrorMessage),
    Sleep(3000)
  )
}
