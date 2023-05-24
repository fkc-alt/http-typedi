# Headers

要指定自定义请求头，可以使用 `@header()` 装饰器

```ts
import { Controller, Post, Header } from 'http-typedi';
import { DemoService } from './demo.service';
import { DemoReq, DemoRes } from './interfaces/demo.interface';

@Controller('demo')
export class DemoController {
  constructor(private demoService: DemoService) {}

  @Post('detail')
  @Header('Cache-Control', 'none')
  async getDemoDetail(demo: DemoReq): ServerRes<DemoRes> {
    return this.demoService.getDemoDetail(demo);
  }
}
```

::: tip
`Header` 需要从 `http-typedi` 包导入。
:::
