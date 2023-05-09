import { HttpFactory } from '../http-typedi'
import AppModule from './app.module'

/**
 *
 * @module Services
 * @return { application } AppModule
 * @description service for entry file
 */
function bootstrap(): AppModule {
  const application = HttpFactory.create(AppModule)
  application.setGlobalCatchCallback((error: any) => {
    console.error(error, 'global catch callback')
  })
  application.setGlobalPrefix(import.meta.env.VITE_APP_BASE_API)
  application.useInterceptorsReq(configure => {
    const Authorization = 'this is authorization'
    if (Authorization && configure.headers)
      configure.headers.Authorization = `Bearer ${Authorization}`
    return configure
  })
  application.useInterceptorsRes(result => {
    console.log('global InterceptorsRes', result)
    const callError = result?.status !== 200 || result?.data?.code !== 200
    if (!callError) return result.data
    return Promise.reject(result) // or throw result
  })
  return application
}
const application = bootstrap()

export { application }
