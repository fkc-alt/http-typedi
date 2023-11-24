# 基于角色认证

让我们构建一个功能更强大的守卫，它只允许具有特定角色的用户访问。我们将从一个基本的守卫模板开始，并在接下来的部分中以它为基础。目前，它允许所有请求通过：

> roles.guard.ts

```ts
import { Injectable, CanActivate, ExecutionContext } from 'http-typedi';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    return true;
  }
}

```