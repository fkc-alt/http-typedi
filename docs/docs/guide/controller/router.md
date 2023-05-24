# 路由

在下面的例子中，我们使用 **`@Controller()`** 装饰器定义一个基本的控制器。可选 路由路径前缀设置为 **`demo`**。
在 **`@Controller()`** 装饰器中使用路径前缀可以使我们轻松地对一组相关的路由进行分组，并最大程度地减少重复代码。例如，我们可以选择将一组用于管理与 **/demo** 下的文章实体进行互动的路由进行分组。这样，我们可以在 **`@Controller()`** 装饰器中指定路径前缀 **`demo`**，这样就不必为文件中的每个路由重复路径的那部分。

> interfaces/article.interface.ts

```ts
export interface UpdateDemoReq {
  name: string;
  id: number;
}
```

> demo.controller.ts
```ts
import { Controller, Post, Header } from 'http-typedi'
import { UpdateDemoReq } from './interfaces/demo.interface'

@Controller('demo')
export class DemoController {
  @Post('update')
  updateDemo(configure: UpdateDemoReq) {
    return 'this is update demo method'
  }
}
```

本例中的updateDemo方法被Post装饰器修饰之后，它已经变成请求路径为demo/update的一个路由，由于方法被 **`@Post`** 修饰，方法的`形参(confugre)`也被重写。下面是被重写之后的形参类型：


```ts
import { UpdateDemoReq } from './interfaces/demo.interface'
interface configure {
    url: string;
    method: string;
    data?: UpdateDemoReq 
    params?: UpdateDemoReq  // 只要被Get修饰过后的方法才会返回params
}
```