# 注册提供者

现在我们已经定义了提供者（`DemoService`），并且已经有了该服务的使用者（`DemoController`），我们需要在 `http-typedi` 中注册该服务，以便它可以执行注入。 为此，我们可以编辑模块文件（`app.module.ts`），然后将服务添加到`@Module()`装饰器的 `providers` 数组中。

> app.module.ts

```ts
import { Module } from 'http-typedi';
import { DemoController } from './demo/demo.controller';
import { DemoService } from './demo/demo.service';

@Module({
  controllers: [DemoController],
  providers: [DemoService],
})
export class AppModule {}
```

得益于此，`http-typedi` 现在将能够解决 `DemoController` 类的依赖关系。这就是我们目前的目录结构：


```
src
├── demo
│    ├──interfaces
│    │     └──demo.interface.ts
│    ├─demo.service.ts
│    ├─demo.controller.ts
│    └─demo.module.ts
├──app.module.ts
└──main.ts
```