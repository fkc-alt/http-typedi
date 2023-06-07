# SetMetadata

`http-typedi` 提供了通过 `@SetMetadata()` 装饰器将定制元数据附加到路由处理程序的能力。这些元数据提供了我们业务中所缺少的数。让我们看看如何使用@SetMetadata():

> demo.controller.ts

```ts{2}
@PostMapping()
@SetMetadata('roles', ['admin'])
async demoDetail(demoDto: DemoDto) {
  return this.demoService.getDemoDetail(DemoDto);
}
```

::: tip
`@SetMetadata()` 装饰器需要从 `http-typedi` 包导入。
:::

通过上面的构建，我们将 `roles` 元数据(`roles` 是一个键，而 `['admin']` 是一个特定的值)附加到 `demoDetail()` 方法。虽然这样可以运行，但直接使用 `@SetMetadata()` 并不是一个好做法。相反，你应该创建你自己的装饰器。

> roles.decorator.ts

```ts
import { SetMetadata } from 'http-typedi'

export const Roles = (...roles: string[]) => SetMetadata('roles', roles)
```

> demo.controller.ts

```ts{2}
@PostMapping()
@Roles('admin')
async demoDetail(demoDto: DemoDto) {
  return await this.demoService.getDemoDetail(DemoDto);
}
```