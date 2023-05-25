# 绑定管道

为了使用管道，我们需要将一个管道类的实例绑定到合适的情境。在我们的 `ParseIntPipe` 示例中，我们希望将管道与特定的路由处理程序方法相关联，并确保它在该方法被调用之前运行。我们使用以下构造来实现，并其称为在方法参数级别绑定管道:

```ts{2}
@Override()
async getDemoDetail(@Param('id', ParseIntPipe) id: number) {
  return this.requestService.request({ id });
}
```

这确保了我们在 `getDemoDetail()` 方法中接收的参数是一个数字(与 `this.demoService.getDemoDetail()` 方法的诉求一致