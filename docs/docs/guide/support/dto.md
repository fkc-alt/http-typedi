# 如何使用DTO

在开始使用之前，我们先安装依赖。

```sh
npm i --save class-validator class-transformer
```

::: tip
当你导入你的 DTO 时，你不能使用仅类型的导入，因为类型会在运行时被擦除，记得用 `import { GetDemoDetailDto }` 而不是 `import type { GetDemoDetailDto }` 。
:::

现在我们可以在 `GetDemoDetailDto` 中添加一些验证规则。我们使用 `class-validator` 包提供的装饰器来实现这一点，[这里](https://github.com/typestack/class-validator#validation-decorators)有详细的描述。以这种方式，任何使用 `GetDemoDetailDto` 的路由都将自动执行这些验证规则。

```ts{4,7}
import { IsEmail, IsNotEmpty } from 'class-validator'

export class GetDemoDetailDto {
  @IsEmail()
  email!: string

  @IsNotEmpty()
  id!: string
}
```

我们来使用一下上面刚创建的 `GetDemoDetailDto`。

```ts{4}
@Controller('/demo')
export class DemoController {
  @GetMapping('detail')
  async getDemoDetail(query: GetDemoDetailDto) {
    return query
  }
}
```

有了这些规则，当客户端使用无效 email 执行对我们的接口的请求时，为了营造良好的体验环境，应用程序会在控制台输出错误信息。以便开发者在调试过程中发现接口字段错误等常见问题。避免参数错误经常询问服务端，造成极大的时间成本。


::: tip
在实际业务开发中，接口参数 or 接口参数类型传递错误非常常见。所以我们强烈建议在开发过程中使用 `DTO` 来规范接口参数。后期维护也会带来质的飞跃。
:::