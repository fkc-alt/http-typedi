# Global Prefix

要为应用程序中的每个路由设置前缀, 让我们使用 `HttpServicesApplication` 对象的 `setGlobalPrefix()` 方法。

```ts{2}
const HTTPClient = HttpFactory.create(ApplicationModule);
HTTPClient.setGlobalPrefix('v1');
```
上述全局前缀将应用于所有路由。类似于这样：`http://localhost:3000/v1/users`
