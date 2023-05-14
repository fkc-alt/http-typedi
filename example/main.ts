import { HttpFactory } from '@/http-typedi'
import AppModule from './app.module'

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
    const callError = result?.status !== 200 || result?.data?.code !== 200
    if (!callError) return result.data
    return Promise.reject(result) // or throw result
  })
  return HTTPClient
}

export const HTTPClient = createHTTPClient()
