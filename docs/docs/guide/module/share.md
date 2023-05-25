# 共享模块

在 `http-typedi`中，默认情况下，模块是**单例**，因此您可以轻松地在多个模块之间共享**同一个**提供者实例。

![图1](https://docs.nestjs.com/assets/Shared_Module_1.png)

实际上，每个模块都是一个**共享模块**。一旦创建就能被任意模块重复使用。假设我们将在几个模块之间共享 `DemoService` 实例。 我们需要把 `DemoService` 放到 `exports` 数组中，如下所示：

> cats.module.ts

```ts{5}
import { Module } from 'http-typedi'
import { DemoController } from './demo.controller'
import { DemoService } from './demo.service'

@Module({
  controllers: [DemoController],
  providers: [DemoService],
  exports: [DemoService]
})
export class DemoModule {}
```

现在，每个导入 `DemoModule` 的模块都可以访问 `DemoService` ，并且它们将共享相同的 `DemoService` 实例。
