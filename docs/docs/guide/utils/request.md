# 网络请求

`Http-Typedi`对发送请求做了一定的包装，并导出了`RequestService`类供客户端和服务端交互使用

::: tip
当您使用的时候，只需要导入`RequestService`工具类并注入到应用程序即可。
:::

## 官方写法

现在我们可以在 `RequestController` 中添加一个简单的官方写法的（`RequestService`）请求接口。我们使用 `Http-Typedi` 包提供的 `RequestService`来实现发送请求。

> request.controller.ts

```ts{12}
import { RequestConfig, RequestService, PostMapping } from 'http-typedi'

interface TData {
  id: number
}

@Controller('/category')
export class UploadController {
  constructor(readonly requestService: RequestService)
  @PostMapping('update')
  async update<T = TData>(configure: RequestConfig<T>) {
    return await this.requestService.request<T, Record<string, any>>(
      <RequestConfig<T>>configure
    )
  }
}
```

以上代码客户端通过UploadController直接调用`update`会直接把`RequestConfig<T>`一并发送至服务端。至此，我们已经完成了与客户端交互的方法。



## 自定义请求

[同官方推荐写法引入一致](./request.md#官方写法)

> custom.request.ts

```ts{12}
import { RequestConfig, RequestService, PostMapping } from 'http-typedi'

interface TData {
  id: number
}

const result = this.requestService.request<TData, Record<string, any>>(<RequestConfig<T>>configure)
```

以上代码则会直接发送网络请求，需要值得注意的是，由于是自定义请求，`configure`字段需要严格按照`RequestConfig`接口定义进行传参。以下是`RequestConfig`接口的类型

```ts
interface RequestConfig<R> {
  url?: string
  method?: import('../../enums').RequestMethod
  headers?: Record<string, any>
  params?: R
  data?: R
  timeout?: number
  customActions?: boolean
  timeoutCallback?(response: ResponseConfig): void
} 
```

如果`method`为`GET`,传入params即可，如果不是传入data即可