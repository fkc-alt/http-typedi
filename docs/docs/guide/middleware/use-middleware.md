# useMiddleware

您可以在函数中或在具有 **`@Injectable()`** 装饰器的类中实现自定义 **`Http-Typedi`** 中间件。 这个类应该实现 **`Middleware`** 接口, 而函数没有任何特殊的要求。 让我们首先使用类方法实现一个简单的中间件功能

> logger.middleware.ts

```ts
import { Injectable, Middleware, NextFunction, MiddlewareResponseContext } from 'http-typedi';

@Injectable()
export class LoggerMiddleware implements Middleware {
  use(req: RequestConfig, res: MiddlewareResponseContext, next: NextFunction) {
    console.log('Request...');
    next();
  }
}

```

`@Module()` 装饰器中没有中间件的位置。 相反，我们使用模块类的 `configure()` 方法设置它们。 包含中间件的模块必须实现 `HttpTypeDIModule` 接口。 让我们在 `AppModule` 级别设置 `LoggerMiddleware`。


> app.module.ts

```ts
import { Module, HttpTypeDIModule, MiddlewareConsumer } from 'http-typedi';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { DemoModule } from './demo/demo.module';

@Module({
  imports: [DemoModule],
})
export class AppModule implements HttpTypeDIModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('demo');
  }
}
```

在上面的示例中，我们为之前在 `DemoController` 中定义的 `/demo` 路由处理程序设置了 `LoggerMiddleware`。 我们还可以通过在配置中间件时将包含路由 `path` 和请求 `method` 的对象传递给 `forRoutes()` 方法，进一步将中间件限制为特定的请求方法。 在下面的示例中，请注意我们导入了 `RequestMethod` 枚举以引用所需的请求方法类型。

> app.module.ts

```ts
import { Module, HttpTypeDIModule, RequestMethod, MiddlewareConsumer } from 'http-typedi';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { DemoModule } from './demo/demo.module';

@Module({
  imports: [DemoModule],
})
export class AppModule implements HttpTypeDIModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'demo', method: RequestMethod.GET });
  }
}
```