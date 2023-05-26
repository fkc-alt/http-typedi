# 最后一步

控制器已经准备就绪，可以使用，但是 Http-Tpedi 依然不知道 `DemoController` 是否存在，所以它不会创建这个类的一个实例。

控制器总是属于模块，这就是为什么我们在 `@Module()` 装饰器中包含 `controllers` 数组的原因。 由于除了根模块 `AppModule`之外，我们还没有定义其他模块，所以我们将使用它来介绍 `DemoController`;

> app.module.ts

```ts
import { Module } from 'http-typedi';
import { DemoController } from './demo/demo.controller';

@Module({
  controllers: [DemoController],
})
export class AppModule {}
```

我们使用 `@Module()` 装饰器将元数据附加到模块类中，现在，Http-Typedi 可以轻松反射（reflect）出哪些控制器（controller）必须被安装。

最后在 `app.module.ts` 中进行路由映射，详情可看[全局路由映射](../global-config/route-reflect.md)

::: tip
`Module` 需要从 `http-typedi` 包导入。
:::
