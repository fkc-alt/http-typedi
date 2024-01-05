# 绑定守卫

与管道和异常过滤器一样，守卫可以是控制范围的、方法范围的或全局范围的。下面，我们使用 **`@UseGuards()`** 装饰器设置了一个控制范围的守卫。这个装饰器可以使用单个参数，也可以使用逗号分隔的参数列表。也就是说，你可以传递几个守卫并用逗号分隔它们。

> roles.guard.ts

```ts
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}
```

::: tip
**`UseGuards`** 需要从 **`http-typedi`** 包导入。
:::

上例，我们已经传递了 **`RolesGuard`** 类型而不是实例, 让框架进行实例化，并启用了依赖注入。与管道和异常过滤器一样，我们也可以传递一个实例(ps: **`构造函数必须传入Reflector的实例`**):


```ts
@Controller('cats')
@UseGuards(new RolesGuard(new Reflector()))
export class CatsController {}
```

上面的构造将守卫附加到此控制器声明的每个处理程序。如果我们希望守卫只应用于单个方法，则需在方法级别应用 **`@UseGuards()`** 装饰器。

如果你需要绑定全局拦截器, 详情可查看[全局守卫](../global-config/use-guards.md)
