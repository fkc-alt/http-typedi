# Global Sleep

要为应用程序中的每个路由设置延时时长, 让我们使用 `HttpServicesApplication` 对象的 `setGlobalSleepTimer()` 方法。

```ts{2}
const HTTPClient = new HttpFactory().create(ApplicationModule);
HTTPClient.setGlobalSleepTimer(1000);
```
上述设置全局请求延时器将应用于所有路由。例如：请求延时 1s 后再发送请求。

::: tip
如果`全局`，`控制器`和`方法`级别的`请求延时器同时存在`，它们将按照以下优先级执行：  
- `方法延时器`
* `控制器延时器`
+ `全局延时器`
:::
