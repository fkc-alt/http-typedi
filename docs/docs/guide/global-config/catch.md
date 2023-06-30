# Global Catch

要为应用程序中的每个路由设置异常处理器, 让我们使用 `HttpServicesApplication` 对象的 `setGlobalCatchCallback()` 方法。

```ts{2}
const HTTPClient = HttpFactory.create(ApplicationModule)
HTTPClient.setGlobalCatchCallback((error: any) => {
  console.error(error, 'global catch callback')
})
```

上述全局异常处理器将应用于所有路由。

::: tip
如果`全局`，`控制器`和`方法`级别的`异常处理器同时存在`，它们只会执行一个处理器回调，将按照以下优先级权重执行：  
- `方法异常处理器`
* `控制器异常处理器`
+ `全局异常处理器`
:::
