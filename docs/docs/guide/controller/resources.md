# 资源

我们已经创建了一个端点来修改 Demo 的数据（*PostMapping* 路由）。我们通常还希望提供一个创建新记录的端点。为此，让我们创建 *GetMapping* 处理程序:

> demo.controller.ts

```ts
import { Controller, PostMapping, Header } from 'http-typedi'
import { UpdateDemoReq } from './interfaces/demo.interface'

@Controller('demo')
export class DemoController {
  @PostMapping('update')
  updateDemo(configure: UpdateDemoReq) {
    return 'this is update demo method'
  }

  @GetMapping('list')
  getDemo() {
    return 'this is get demo method'
  }
}
```

就这么简单。 `http-typedi` 为所有标准的 HTTP 方法提供了相应的装饰器：`@PutMapping()`、`@DeleteMapping()`、`@PatchMapping()`、`@OptionsMapping()`、以及 `@HeadMapping()`。