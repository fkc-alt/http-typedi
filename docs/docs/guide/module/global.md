# 全局模块

如果你不得不在任何地方导入相同的模块，那可能很烦人。在 [Angular](https://angular.io/) 中，提供者是在全局范围内注册的。一旦定义，他们到处可用。另一方面，http-typedi 将提供者封装在模块范围内。您无法在其他地方使用模块的提供者而不导入他们。但是有时候，你可能只想提供一组随时可用的东西 - 例如：helper，http请求类等等。这就是为什么你能够使模块成为全局模块。

```ts{5}
import { Module, Global } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

@Global()
@Module({
  controllers: [DemoController],
  providers: [DemoService],
  exports: [DemoService],
})
export class DemoModule {}
```

`@Global` 装饰器使模块成为全局作用域。 全局模块应该只注册一次，最好由根或核心模块注册。 在上面的例子中，`DemoService` 组件将无处不在，而想要使用 `DemoService` 的模块则不需要在 `imports` 数组中导入 `DemoModule`。

::: tip
使一切全局化并不是一个好的解决方案。 全局模块可用于减少必要模板文件的数量。 `imports` 数组仍然是使模块 API 透明的最佳方式。
:::