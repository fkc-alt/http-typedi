# UseInterceptorsRes

此为请求前置拦截器，我们来看一下如何使用`UseInterceptorsRes`，下面是一个例子：

::: tip
`UseInterceptorsRes`拦截器可以在[Controller](../controller/)中使用，也可以在[Router](../controller/router.md)中使用。
:::

> demo.controller.ts

```ts{13}
import { Controller, Post, UseInterceptorsRes } from 'http-typedi'
import { DemoService } from './demo.service'
import { DemoDetailReq } from './interfaces/demo.interface'

function InterceptorsRes(result) {
  console.log(result, 'Controller InterceptorsRes')
  const callError = result?.status !== 200 || result?.data?.code !== 200
  if (!callError) return result.data
  return Promise.reject(result) // or throw result
}

@Controller('demo')
@UseInterceptorsRes(InterceptorsRes)
export class DemoController {
  constructor(private readonly demoService: DemoService) {}
  @Get('demoDetail/:id')
  getDemoDetail(confugre: DemoDetailReq) {
    return this.demoService.getDemoDetail(<AxiosRequestConfig>confugre)
  }
}
```

上述例子中，我们使用了`UseInterceptorsRes`，它的参数是一个函数，这个函数会在请求后执行，我们可以在这里做一些请求后的处理，比如判断返回的状态码，判断返回的数据等等。

上面的构造将拦截器附加到此控制器声明的每个处理程序。如果我们决定只限制其中一个, 我们只需在方法级别设置拦截器。下面是一个例子：

```ts{5}
@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}
  @Get('demoDetail/:id')
  @UseInterceptorsRes(InterceptorsRes)
  getDemoDetail(confugre: DemoDetailReq) {
    return this.demoService.getDemoDetail(<AxiosRequestConfig>confugre)
  }
}
```

如果你需要绑定全局拦截器, 详情可查看[全局拦截器](../global-config/use-interceptors.md)