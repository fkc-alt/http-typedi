# 授权守卫

正如前面提到的，授权是守卫的一个很好的用例，因为只有当调用者(通常是经过身份验证的特定用户)具有足够的权限时，特定的路由才可用。我们现在要构建的 **`AuthGuard`** 假设用户是经过身份验证的(因此，请求头附加了一个 **`token`**)。它将提取和验证 **`token`**，并使用提取的信息来确定请求是否可以继续。

> auth.guard.ts

```ts
import { Injectable, CanActivate, ExecutionContext } from 'http-typedi';


function validateRequest<T>(req: RequestConfig<T>): boolean | Promise<boolean> {
  // custom validation
  console.log(req, 'validateRequest')
  return req.method === RequestMethod.GET
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

**`validateRequest()`** 函数中的逻辑可以根据需要变得简单或复杂。本例的主要目的是说明守卫如何适应请求/响应周期。

每个守卫必须实现一个 **`canActivate()`** 函数。此函数应该返回一个布尔值，用于指示是否允许当前请求。它可以同步或异步地返回响应通过 **`Promise`**。 **`Http-Typedi`** 使用返回值来控制下一个行为:

如果返回 **`true`**, 将处理用户调用。
如果返回 **`false`**, 则 **`Http-Typedi`** 将忽略当前处理的请求。