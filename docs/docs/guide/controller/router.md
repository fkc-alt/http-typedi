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
import { Controller, PostMapping, Header } from 'http-typedi'
import { UpdateDemoReq } from './interfaces/demo.interface'

@Controller('demo')
export class DemoController {
  @PostMapping('update')
  updateDemo(configure: UpdateDemoReq) {
    return 'this is update demo method'
  }
}
```

本例中的updateDemo方法被Post装饰器修饰之后，它已经变成请求路径为demo/update的一个路由，由于方法被 **`@PostMapping`** 修饰，方法的`形参(confugre)`也被重写。下面是被重写之后的形参类型：


```ts
import { UpdateDemoReq } from './interfaces/demo.interface'
interface configure {
    url: string;
    method: string;
    data?: UpdateDemoReq 
    params?: UpdateDemoReq  // 只要被Get修饰过后的方法才会返回params
}
```

我们强烈建议在每个路由应该实现可以请求服务端的接口。所以下面我们先创建一个[依赖](../provider/index.md)请求类供[controller](./index.md)类使用

::: tip
本章采用[`Axios`](https://github.com/axios/axios)插件作为请求工具，如果你不想使用`Axios`，可以自行实现一个请求类，只要实现了上述重写后的`configure`接口即可
后续有时间会扩展一个请求类的接口，方便用户直接使用
:::

```ts
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Injectable } from 'http-typedi'

interface Response<T = unknown> {
  readonly code: number
  readonly message: string
  data: T
}

type ServerRes<T, U = Promise> = U extends Promise
  ? Promise<Response<T>>
  : Response<T>

@Injectable()
export class RequestService {
  private _instance!: AxiosInstance
  /**
   * @method constructor
   */
  constructor() {
    this.forRoot()
  }
  public async request<T, U>(config: AxiosRequestConfig<T>): ServerRes<U> {
    return await this.instance.request<{}, ServerRes<U>, T>(config)
  }

  /**
   * @method forRoot
   * @param { AxiosRequestConfig } AxiosRequestConfig
   * @description Set Configure
   */
  public forRoot(config: AxiosRequestConfig = {}): void {
    this.instance = axios.create(config)
  }

  /**
   * @method getters
   * @return { AxiosInstance } AxiosInstance
   * @description instance Getter
   */
  private get instance(): AxiosInstance {
    return this._instance
  }

  /**
   * @method setters
   * @description instance Setter
   */
  private set instance(axiosInstance: AxiosInstance) {
    this._instance = axiosInstance
  }
}
```

下面我们创建一个基本的被[@Injectable()](../provider/index.md)修饰之后的类并使用上面创建的请求类。  


> demo.service.ts

```ts
import { Injectable } from 'http-typedi'
import { RequestService, ServerRes } from './request.service'
import { DemoReq, DemoRes } from './interfaces/demo.interface'
@Injectable()
export default class DemoService {
  constructor(private requestService: RequestService) {}
  private readonly url: stirng = 'http://localhost:8080'
  public getDemoDetail(param: DemoReq): ServerRes<DemoRes> {
     return this.requestService.request(param)
  }
}
```

::: tip
`constructor(private requestService: RequestService) {}`这段代码详情可了解[`依赖注入`](../provider/index.md)章节
:::

我们的 `DemoService` 是具有一个属性和一个方法的基本类。唯一的新特点是它使用 `@Injectable()` 装饰器。该 `@Injectable()` 附加有元数据，因此 `http-typedi` 知道这个类是一个 `http-typedi` provider。需要注意的是，上面有一个 `Demo` 接口。看起来像这样：

> interfaces/demo.interface.ts


```ts
export interface DemoReq {
  name: string;
  age: number;
  breed: string;
}

export interface DemoRes {
  list: string[]
}
```

现在我们有一个控制器类来检索 `Demo` ，让我们在 `DemoController` 里使用它 ：

```typescript
import { Controller, PostMapping } from 'http-typedi';
import { DemoService } from './demo.service';
import { DemoReq, DemoRes } from './interfaces/demo.interface';

@Controller('demo')
export class DemoController {
  constructor(private demoService: DemoService) {}

  @PostMapping('detail')
  async getDemoDetail(demo: DemoReq): ServerRes<DemoRes> {
    return this.demoService.getDemoDetail(demo);
  }
}
```

`DemoService` 是通过类构造函数注入的。注意这里使用了私有的只读语法。这意味着我们已经在同一位置创建并初始化了 `demoService`成员。

在上面的示例中，用户通过调用`getDemoDetail`方法触发 `@PostMapping('detail')` 装饰器告诉 `http-typedi` 当前方法为需要和服务端进行通信的方法和请求路径。 什么是路由路径 ？ 一个处理程序的路由路径是通过连接为控制器 （Controller） 声明的（可选）前缀和请求装饰器中指定的任何路径来确定的。由于我们已经为当前的 Controller 声明了一个前缀，并且在请求装饰器（@PostMapping('detail')）中添加了`detail`后缀，因此 http-typedi 会通过 `@PostMapping('detail')` 装饰器进行处理并返回请求路径为 `/demo/detail`，Route 路由并且携带请求参数调用 `demoService` 实例的 `getDemoDetail` 方法传入请求参数信息和服务端进行通信获取到数据之后从而返回给`控制器`，`控制器`再返回给`调用者`。


::: tip
建议`控制器`中的`路由`只进行调用，不要进行数据处理，数据处理应该交给`服务`层(例如：DemoService)进行处理
:::
