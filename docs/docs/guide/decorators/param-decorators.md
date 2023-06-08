# 参数装饰器

## Request

处理程序有时需要访问客户端的**请求**细节。Http-Typedi 提供了对底层平台请求对象（**request**）的访问方式。我们可以在处理函数的签名中使用 `@Req()` or `@Request()` 装饰器，指示 Http-Typedi 将请求对象注入处理程序。

> demo.controller.ts

```ts{9}
import { Controller, PostMapping, Req } from 'http-typedi'
import { DemoService } from './demo.service'
import { DemoReq, DemoRes } from './interfaces/demo.interface'

@Controller('demo')
export class DemoController {
  constructor(private demoService: DemoService) {}

  @PostMapping('updateDetail')
  async updateDemoDetail(@Req() demo: DemoReq): ServerRes<DemoRes> {
    return this.demoService.updateDemoDetail(demo)
  }
}
```

`@Request()/@Req()`会返回这样`RequestConfig`这个接口的数据，就像下面这样

```ts
interface RequestConfig<D = unknown> {
  url?: string
  method?: Method
  headers?: Record<string, string | number | boolean>
  params?: any
  data?: D
}
```

`Request` 对象代表 `HTTP` 请求，并具有查询字符串，请求参数参数，HTTP 标头（HTTP header） 和 正文（HTTP body）的属性。在多数情况下，不必手动获取它们。 我们可以使用专用的装饰器，比如开箱即用的 `@Body()` 或 `@Param()` 或 `@Headers()`。

## Body

使用`@Body()`装饰器之后，会返回`RequestConfig`这个接口的`data`属性提取出来，使用方式例如

```ts{2}
@PostMapping('updateDetail')
async updateDemoDetail(@Body() demo: DemoReq): ServerRes<DemoRes> {
  return this.demoService.updateDemoDetail(demo)
}
```

## Headers

使用`@Headers()`装饰器之后，会返回`RequestConfig`这个接口的`headers`属性提取出来
```ts{2}
@PostMapping('updateDetail')
async updateDemoDetail(@Headers() demo: DemoReq): ServerRes<DemoRes> {
  return this.demoService.updateDemoDetail(demo)
}
```
## Param

使用`@Param()`装饰器之后，会返回`RequestConfig`这个接口的`params`属性提取出来
```ts{2}
@GetMapping('updateDetail')
async updateDemoDetail(@Param() demo: DemoReq): ServerRes<DemoRes> {
  return this.demoService.updateDemoDetail(demo)
}
```


上述使用方式是直接提取HTTP请求的一些细节参数，其实还可以通过传入的`token`再次提取指定参数，也可以绑定上[`管道(自定义管道)`](../pipe/index.md)进行过滤，下面我们来看一个例子：

```ts{10,15}
import { Controller, PostMapping, GetMapping, Body } from 'http-typedi'
import { DemoService } from './demo.service'
import { DemoReq, DemoRes } from './interfaces/demo.interface'

@Controller('demo')
export class DemoController {
  constructor(private demoService: DemoService) {}

  @PostMapping('updateDetail')
  async updateDemoDetail(@Body('id') demo: DemoReq): ServerRes<DemoRes> {
    return this.demoService.updateDemoDetail(demo)
  }

  @GetMapping('getdetail')
  async getDemoDetail(@Param('id', new DefaultValuePipe(1)) demo: DemoReq): ServerRes<DemoRes> {
    return this.demoService.getDemoDetail(demo)
  }
}
```

我们先说`updateDemoDetail`这个路由使用`@Body`装饰器传递了一个id参数，那么`Http-Typedi`就会根据传入的这个参数当作token去通过`@Body`装饰器返回的data参数中去匹配参数名为`id`键。并返回对应的value。`@Req`、`@Request`、`@Param`、`@Headers`都支持此用法。

`getDemoDetail`我们使用`@Param`装饰器传递了一个id参数，并且还传入了第二个参数，默认第一个参数为token，剩余的参数为pipes，pipes会被http-typedi统一收集起来，这里我们使用了`Http-typedi`的管道[`pipe`](../pipe/index.md)。上面通过传入的`id`这个参数当作token去通过`@Body`装饰器返回的data参数中去匹配参数名为`id`键，如果没找到。则使用[`DefaultValuePipe`](../pipe/index.md)传入的value当作value返回。类似于JavaScript函数形参默认值的写法。