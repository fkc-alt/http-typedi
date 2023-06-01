# Request

处理程序有时需要访问客户端的**请求**细节。Http-Typedi 提供了对底层平台请求对象（**request**）的访问方式。我们可以在处理函数的签名中使用 `@Req()` 装饰器，指示 Http-Typedi 将请求对象注入处理程序。

> demo.controller.ts

```ts
import { Controller, Post, Req } from 'http-typedi';
import { DemoService } from './demo.service';
import { DemoReq, DemoRes } from './interfaces/demo.interface';

@Controller('demo')
export class DemoController {
  constructor(private demoService: DemoService) {}

  @Post('updateDetail')
  async updateDemoDetail(@Req() demo: DemoReq): ServerRes<DemoRes> {
    return this.demoService.updateDemoDetail(demo);
  }
}
```

`Request` 对象代表 `HTTP` 请求，并具有查询字符串，请求参数参数，HTTP 标头（HTTP header） 和 正文（HTTP body）的属性。在多数情况下，不必手动获取它们。 我们可以使用专用的装饰器，比如开箱即用的 `@Body()` 或 `@Query()` 或 `@Param()`。

::: tip
`@Body()`、`@Query()`、`@Param()` 正在开发中～，后续会进行发布
:::