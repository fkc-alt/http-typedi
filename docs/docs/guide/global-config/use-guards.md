# Global UseGuards

要为应用程序中的每个路由设置守卫, 让我们使用 `HttpServicesApplication` 对象的 `useGlobalGuards()` 方法。它们的参数是一个或多个守卫函数。
下面我们来看一下`useGlobalGuards()` 例子：

> useInterceptorsReq

```ts{2}
const HTTPClient = HttpFactory.create(ApplicationModule)
HTTPClient.useGlobalGuards(new RolesGuard())
```


上述全局守卫将应用于所有路由。

::: tip
如果`全局`，`控制器`和`方法`级别的`守卫同时存在`，它们将按照以下优先级执行(`由高到低，只会执行优先级高的守卫`)：  
- `方法守卫`
* `控制器守卫`
+ `全局守卫`
:::
