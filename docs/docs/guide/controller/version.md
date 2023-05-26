# Version

接口版本可以在同一个应用程序中的控制器或者路由层面支持 **不同的版本**。 应用程序经常更改，在仍然需要支持以前版本的应用程序的同时，需要进行重大更改的情况并不少见。

Http-typedi 支持一下 2 种形式的版本管理：

URI 版本类型	版本在请求的 URI 中传递 （默认）
Header 版本管理	在自定义的 Header 中传递版本

| URI 版本类型        | 版本在请求的 URI 中传递 （默认）                             |
| ----------------- | :------------------------------------------------------: |
| Header  版本管理   | 在自定义的 Header 中传递版本                                 |


要使用版本控制，您需要在 `@Version()` 装饰器或[`Header`](./headers.md) 或使用`Controller`指定版本：

我们先来看看如何使用 `@Version()` 装饰器：

```ts
@Controller('demo')
class DemoControler {
  @Get('detail')
  @Version('1')
  getDemoDetail(demo: DemoReq) {
    return 'This action returns all demos';
  }
}
```

上述例子中它的路由将会是 `/article/v1/detail`。

::: tip
`Version` 需要从 `http-typedi` 包导入。
:::

我们再来看使用 `Header` 的例子：

```ts
@Controller('demo')
class DemoControler {
  constructor(private demoService: DemoService) {}

  @Get('detail')
  @Header('version', '1')
  getDemoDetail(demo: DemoReq) {
    return this.demoService.getDemoDetail(demo);
  }
}
```

上述例子中他的请求头将会是 `version: 1`。

我们再来看看如何使用 `Controller` 指定版本：

```ts
@Controller('demo', { version: '1' })
class DemoControler {
  constructor(private demoService: DemoService) {}

  @Get('detail')
  geDemoDetail(demo: DemoReq) {
    return this.demoService.getDemoDetail(demo);
  }
}
```

上述例子中他的路由将会是 `v1/demo/detail`。
