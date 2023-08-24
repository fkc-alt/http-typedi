# createParamDecorator

`http-typedi` 提供了一种辅助方法来创建自定义参数装饰器。假设您要获取请求配置细节并返回新的请求配置。这可以通过以下方法实现：

```ts{17}
import { createParamDecorator, Controller, PostMapping, RequestService, ExecutionContext } from 'http-typedi'

const CustomRequestDecorator = createParamDecorator((token: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  console.log(token, request, 'ExecutionContext')
  return token ? request[token] : request
})

@Controller('demo')
class DemoController() {
  constructor(private readonly requestService: RequestService) {}

  @PostMapping('updateDemo')
  public async updateDemo<
    T = Service.UpdateDemoReq,
    U = Service.UpdateDemoRes
  >(@CustomRequestDecorator() configure: T): ServerRes<U> {
    console.log(configure, 'customRequestConf')
    return await this.requestService.request<T, ServerRes<U>>(
      <RequestConfig<T>>configure
    )
  }
}
```

上述例子使用了自定义参数装饰器来进行修改`updateDemo`方法形参请求配置的数据。createParamDecorator接受一个函数，第一个参数可以当作参数传入，第二个参数是获取当前请求的细节方法，（Http-typedi）会帮我们注入进去，如果获取请求细节的同事我们要传参进去只需要考虑传第一个参数就可以。