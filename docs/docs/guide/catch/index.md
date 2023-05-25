# 异常处理器

内置的**异常层**负责处理整个应用程序中的所有抛出的异常。当捕获到未处理的异常时，最终用户将收到友好的响应。

`http-typedi`提供了一个内置的 `Catch` 装饰器，它从 `http-typedi` 包中导入。

在 DemoController，我们有一个 getDemoDetail() 方法（GET 路由）。假设此路由处理程序由于某种原因引发异常。 为了说明这一点，我们将对其进行如下硬编码：

> demo.controller.ts

```ts{7}
function catchCallback(error: any) {
  console.log('error', error)
  alert(error.message)
}

@Get()
@Catch(catchCallback)
async getDemoDetail() {
  throw new Error('This action throws an error')
}
```

上述例子中，我们使用 Catch 装饰器，它的参数是一个函数，这个函数会在请求后执行，它会捕获到请求程序错误并且发送一个错误回调并传入错误信息。我们可以在这里做一些请求后的异常处理，比如判断异常原因。

它还可以应用在控制器上，就像下面这样：

```ts{1}
@Catch(catchCallback)
class DemoController {
  @Get()
  async getDemoDetail() {
    throw new Error('This action throws an error')
  }
}
```
上述例子中，在控制器层面使用 `Catch` 装饰器，它会影响到当前控制器中所有的路由处理程序。只要有一个路由处理程序抛出异常，就会触发 `Catch` 装饰器中的回调函数。

`http-typedi` 做了很好的一套异常处理，也可以在全局使用，如果你需要绑定全局异常处理器, 详情可查看[全局异常处理器](../global-config/catch.md)。
