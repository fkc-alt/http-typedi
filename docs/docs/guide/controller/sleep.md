# Sleep

如果您需要延迟路由请求时间，可以使用 `@Sleep()` 装饰器,该方法形参接受一个`number`类型的参数，单位为毫秒（`ms`）

```ts
import { Controller, PostMapping, Sleep } from 'http-typedi';
import { DemoService } from './demo.service';
import { DemoReq, DemoRes } from './interfaces/demo.interface';

@Controller('demo')
export class DemoController {
  constructor(private demoService: DemoService) {}

  @PostMapping('updateDetail')
  @Sleep(1000)
  async updateDemoDetail(demo: DemoReq): ServerRes<DemoRes> {
    return this.demoService.updateDemoDetail(demo);
  }
}
```

::: tip
`Sleep`需要从`http-typedi`包导入。
:::
