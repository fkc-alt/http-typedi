# 自定义管道

正如上文所提到的，你可以构建自定义管道。虽然 `http-typedi`提供了强大的内置 `ParseIntPipe` 和 `ValidationPipe`，但让我们从头开始构建它们的简单自定义版本，以了解如何构建自定义管道。

先从一个简单的 `ValidationPipe` 开始。最初，我们让它接受一个输入值并立即返回相同的值。

> validation.pipe.ts

```ts
import { PipeTransform, Injectable } from 'http-typedi'

export class ValidationPipe implements PipeTransform {
  transform(value: any) {
    return value
  }
}
```

`PipeTransform<T, R>` 是每个管道必须要实现的泛型接口。泛型 `T` 表明输入的 `value` 的类型，`R` 表明 `transfrom()` 方法的返回类型

为实现 `PipeTransfrom`，每个管道必须声明 `transfrom()` 方法。该方法有一个参数：

- `value`

`value` 参数是当前处理的方法参数(在被路由处理程序方法接收之前)

下面是一个使用的例子

> example

```ts
@PostMapping('tabledataList')
public async GetTableDataList(@Request('id', new ValidationPipe('token')) configure: TableDataDto) {
  console.log(configure, 'ValidationPipe')
  return await this.articleService.GetTableDataList(configure)
}
```
