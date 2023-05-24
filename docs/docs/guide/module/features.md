# 功能模块

`DemoController` 和 `DemoService` 属于同一个应用程序域。 应该考虑将它们移动到一个功能模块下，即 `DemoModule`。

> demo/demo.module.ts

```ts
import { Module } from 'http-typedi'
import { DemoController } from './demo.controller'
import { DemoService } from './demo.service'

@Module({
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
```

我已经创建了 `demo.module.ts` 文件，并把与这个模块相关的所有东西都移到了 demo目录下。我们需要做的最后一件事是将这个模块导入根模块 `(ApplicationModule)`。

> app.module.ts

```ts
import { Module } from 'http-typedi'
import { DemoModule } from './demo/demo.module'

@Module({
  imports: [DemoModule],
})
export class ApplicationModule {}
```

现在 `http-typedi` 知道除了 `ApplicationModule` 之外，注册 `DemoModule` 也是非常重要的。 这就是我们现在的目录结构:

```
src
├──demo
│    ├──interfaces
│    │     └──demo.interface.ts
│    ├─demo.service.ts
│    ├─demo.controller.ts
│    └──demo.module.ts
├──app.module.ts
└──main.ts
```
