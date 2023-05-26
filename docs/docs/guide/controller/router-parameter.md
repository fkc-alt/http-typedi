# 路由参数

当您需要接受**动态数据**（dynamic data）作为请求的一部分时（例如，使用GET /demo/detail/1 来获取 id 为 1 的 demo），带有静态路径的路由将无法工作。为了定义带参数的路由，我们可以在路由路径中添加路由参数**标记**（token）以捕获请求 URL 中该位置的动态值。下面的 `@Get()` 装饰器示例中的路由参数标记（route parameter token）演示了此用法

```ts
import { Controller, Get, Header } from 'http-typedi';
import { DemoDetailReq } from './interfaces/demo.interface';

@Controller('demo')
export class DemoController {
  constructor(private demoService: DemoService) {}

  @Get('detail/:id')
  getDemoDetail(configure: DemoDetailReq) {
    return this.demoService.getDemoDetail(demo);
  }
}
```
