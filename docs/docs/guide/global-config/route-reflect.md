# 全局路由映射

```ts
@Module({
  imports: [DemoModule],
  controllers: [DemoController]
})
export default class AppModule {
  constructor(
    readonly demoController: DemoController
  ) {}
}
```

上述例子是引入了一个demo模块，如果你有更多的模块，可以追加引入。最后我们看看如何使用您的模块提供的路由。

> main.ts

```ts
import 'reflect-metadata'
import { HttpFactory } from 'http-typedi'
import AppModule from './app.module'

/**
 *
 * @module Services
 * @return { AppModule } AppModule
 * @description service for entry file
 */
function createHTTPClient(): AppModule {
  const HTTPClient = HttpFactory.create(AppModule)
  return HTTPClient
}
export const HTTPClient = createHTTPClient()

// 模拟调用DemoController的getDemoDetail方法

HTTPClient.demoController.getDemoDetail({
  name: 'test',
  age: 18,
  breed: 'test'
}).then(res => {
  console.log(res)
})
```
上述例子中，我们通过`HttpFactory`创建了一个`HTTPClient`，然后通过`HTTPClient`调用`DemoController`的`getDemoDetail`方法，这样就可以调用到`DemoController`中的`getDemoDetail`方法了。
