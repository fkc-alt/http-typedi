# UseInterceptorsRes

此为请求前置拦截器，我们来看一下如何使用`UseInterceptorsRes`，下面是一个例子：

> demo.controller.ts

```typescript
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

上述例子中，我们使用了`UseInterceptorsReq`，它的参数是一个函数，这个函数会在请求前执行，我们可以在这里做一些请求前的处理，比如添加请求头，添加请求参数等等。

::: tip
`UseInterceptorsRes`拦截器可以在[Controller](../controller/)中使用，也可以在[Router](../controller/router.md)中使用。
:::