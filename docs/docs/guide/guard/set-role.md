# 为每个处理器设置角色

我们的 **`RolesGuard`** 现在在正常工作，但还不是很智能。我们仍然没有利用最重要的守卫的特征，即执行上下文。它还不知道角色，或者每个处理程序允许哪些角色。例如，**`CatsController`** 可以为不同的路由提供不同的权限方案。其中一些可能只对管理用户可用，而另一些则可以对所有人开放。我们如何以灵活和可重用的方式将角色与路由匹配起来?

这就是自定义元数据发挥作用的地方(从这里了解更多)。 **`Http-Typedi`** 提供了通过 **`@SetMetadata()`** 装饰器将定制元数据附加到路由处理程序的能力。这些元数据提供了我们所缺少的角色数据，而守卫需要这些数据来做出决策。让我们看看使用**`@SetMetadata()`**:

> cats.controller.ts

```ts
@PostMapping()
@SetMetadata('roles', ['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

::: tip
**`@SetMetadata()`** 需要从 **`http-typedi`** 包导入。
:::

通过上面的构建，我们将 **`roles`** 元数据(**`roles`** 是一个键，而 **`['admin']`** 是一个特定的值)附加到 **`create()`** 方法。虽然这样可以运行，但直接使用 **`@SetMetadata()`** 并不是一个好做法。相反，你应该创建你自己的装饰器

> roles.decorator.ts

```ts
import { SetMetadata } from 'http-typedi';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

```

这种方法更简洁、更易读，而且是强类型的。现在我们有了一个自定义的 **`@Roles()`** 装饰器，我们可以使用它来装饰 **`create()`**方法。

> cats.controller.ts

```ts
@PostMapping()
@Roles('admin')
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}

```