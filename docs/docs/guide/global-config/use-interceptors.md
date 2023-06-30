# Global UseInterceptors

要为应用程序中的每个路由设置请求拦截器, 让我们使用 `HttpServicesApplication` 对象的 `useInterceptorsReq()` 和 `useInterceptorsRes()` 方法。它们的参数是一个或多个拦截器函数。
下面我们来看一下`useInterceptorsReq()` 和 `useInterceptorsRes()`例子：

::: info useInterceptorsReq
```ts{2}
const HTTPClient = HttpFactory.create(ApplicationModule)
HTTPClient.useInterceptorsReq(configure => {
  const Authorization = 'this is authorization'
  if (Authorization && configure.headers)
    configure.headers.Authorization = `Bearer ${Authorization}`
  return configure
})
```
:::

::: info useInterceptorsRes
```ts{2}
const HTTPClient = HttpFactory.create(ApplicationModule)
HTTPClient.useInterceptorsRes(result => {
  console.log('global InterceptorsRes', result)
  const callError = result?.status !== 200 || result?.data?.code !== 200
  if (!callError) return result.data
  return Promise.reject(result) // or throw result
})
```
:::

上述全局拦截器将应用于所有路由。

::: tip
如果`全局`，`控制器`和`方法`级别的`拦截器同时存在`，它们将按照以下优先级执行：  
- `方法拦截器`
* `控制器拦截器`
+ `全局拦截器`
:::
