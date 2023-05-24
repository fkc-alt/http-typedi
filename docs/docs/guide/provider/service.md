# 服务

让我们从创建一个简单的 `DemoService` 开始。该服务将负责数据存储和检索，其由 `DemoService` 使用，因此把它定义为 `provider`，是一个很好的选择。因此，我们用 `@Injectable()` 来装饰这个类 。

> demo.service.ts

```ts
import { Injectable } from 'http-typedi'
import { DemoDetailReq, Demo } from './interfaces/demo.interface'

@Injectable()
export class DemoService {
  private readonly demos: Demo[] = []

  getDemoList(configure: DemoDetailReq) {
    return this.demos
  }
}
```

我们的 `DemoService` 是具有一个属性和一个方法的基本类。唯一的新特点是它使用 `@Injectable()` 装饰器。该 `@Injectable()` 附加有元数据，因此 `http-typedi` 知道这个类是一个 `http-typedi` provider。需要注意的是，上面有一个 `DemoDetailReq` 和`Demo`接口。看起来像这样：

> interfaces/cat.interface.ts
  
```ts
export interface DemoDetailReq {
  name: string;
  age: number;
  breed: string;
}

export interface Demo {
  name: string;
  age: number;
  breed: string;
  id: number;
  createTime: string;
}
```

现在我们有一个服务类来检索 `DemoDetailReq`，让我们在 `DemoController` 里使用它 ：

> demo.controller.ts

```ts
import { Controller, Post } from 'http-typedi';
import { DemoService } from './demo.service';
import { DemoReq, DemoRes } from './interfaces/demo.interface';

@Controller('demo')
export class DemoController {
  constructor(private demoService: DemoService) {}

  @Post('list')
  async getDemoList(demo: DemoReq): ServerRes<DemoRes> {
    return this.demoService.getDemoList(demo);
  }
}
```

`DemoService` 是通过类构造函数注入的。注意这里使用了私有的只读语法。这意味着我们已经在同一位置创建并初始化了 `demoService`成员。