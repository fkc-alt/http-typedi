# UseInterceptorsReq

此为请求前置拦截器，我们来看一下如何使用`UseInterceptorsReq`，下面是一个例子：

::: tip
`UseInterceptorsReq`拦截器可以在[Controller](../controller/)中使用，也可以在[Router](../controller/router.md)中使用。
:::

> demo.controller.ts

```ts{11}
import { Controller, PostMapping, UseInterceptorsReq } from 'http-typedi'
import { DemoService } from './demo.service'
import { DemoDetailReq } from './interfaces/demo.interface'

function InterceptorsReq (config) {
  console.log(`Before...`)
  return config
}

@Controller('demo')
@UseInterceptorsReq(InterceptorsReq)
export class DemoController {
  constructor(private readonly demoService: DemoService) {}
  @GetMapping('demoDetail/:id')
  getDemoDetail(confugre: DemoDetailReq) {
    return this.demoService.getDemoDetail(<AxiosRequestConfig>confugre)
  }
}
```

上述例子中，我们使用了`UseInterceptorsReq`，它的参数是一个函数，这个函数会在请求前执行，我们可以在这里做一些请求前的处理，比如添加请求头，添加请求参数等等。
上面的构造将拦截器附加到此控制器声明的每个处理程序。如果我们决定只限制其中一个, 我们只需在方法级别设置拦截器。下面是一个例子：


```ts{5}
@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}
  @GetMapping('demoDetail/:id')
  @UseInterceptorsReq(InterceptorsReq)
  getDemoDetail(confugre: DemoDetailReq) {
    return this.demoService.getDemoDetail(<AxiosRequestConfig>confugre)
  }
}
```


如果你需要绑定全局拦截器, 详情可查看[全局拦截器](../global-config/use-interceptors.md)