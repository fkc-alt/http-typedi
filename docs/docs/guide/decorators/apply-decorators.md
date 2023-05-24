# applyDecorators

`http-typedi` 提供了一种辅助方法来聚合多个装饰器。例如，假设您要将与身份验证相关的所有装饰器聚合到一个装饰器中。这可以通过以下方法实现：

```ts
import { applyDecorators } from 'http-typedi'

export function ControllerApplydecorators(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    Controller(Route.ARTICLE, { version: '' }),
  );
}
```

然后，你可以参照以下方式使用 `@ControllerApplydecorators()` 自定义装饰器：

```ts
@ControllerApplydecorators('admin')
class DemoController() {}
```

这具有通过一个声明应用所有多个个装饰器的效果。

::: tip
`applyDecorators`可用`类装饰器`和`方法装饰器`。支持在**类**和**类方法**上使用
:::