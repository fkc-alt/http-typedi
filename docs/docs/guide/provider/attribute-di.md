# 属性注入

我们目前使用的技术称为基于构造函数的注入，即通过构造函数方法注入 providers。在某些非常特殊的情况下，基于属性的注入可能会有用。例如，如果顶级类依赖于一个或多个 providers，那么通过从构造函数中调用子类中的 `super()` 来传递它们就会非常烦人了。因此，为了避免出现这种情况，可以在属性上使用 @Injection() 装饰器。

```ts
@Controller('demo')
export class DemoController {
  @Injection()
  private readonly demoService!: DemoService;

  @PostMapping('detail')
  async getDemoDetail(demo: DemoReq): ServerRes<DemoRes> {
    return this.demoService.getDemoDetail(demo);
  }
}
```

上例中使用``@Injection()``装饰的属性会被注入为一个服务实例。和上例的构造函数注入一样，属性注入也是通过类型来注入的，所以我们需要在属性声明的时候指定类型。`@Injection()`在没有参数的情况下必须声明属性的类型


# 属性具名注入

``Injection``装饰器可以接受一个参数,参数为一个字符串，的字符串为需要注入的服务的名称，如果传入参数，则会从服务容器中获取对应名称的服务实例，如果没有传入参数，则会从服务容器中获取属性声明的类型对应的服务实例，我们来看一个使用参数的例子

> demo.module.ts

```ts
import { Module } from 'http-typedi';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

@Module({
  controllers: [DemoController],
  providers: [DemoService, {
    provide: 'config',
    useValue: {
      url: 'http://localhost:5173'
    }
  }],
})
export class DemoModule {}

```

> demo.controller.ts

```ts
import { Controller, PostMapping, Injection } from 'http-typedi';
import { DemoService } from './demo.service';
import { DemoReq, DemoRes } from './interfaces/demo.interface';

@Controller('demo')
export class DemoController {
  @Injection('config')
  private readonly config;

  @PostMapping('detail')
  async getDemoDetail(demo: DemoReq): ServerRes<DemoRes> {
    return this.demoService.getDemoDetail(demo);
  }
}
```

上例中使用``@Injection('config')``进行属性注入，由于传入了参数，所以会从服务容器中获取名称为``config``的服务实例，如果没有传入参数，则会从服务容器中获取属性声明的类型对应的服务实例 （不使用具名注入必须传递参数类型），如果使用具名注入想更好的获取类型提示，也可以在属性声明的时候指定类型，如下例所示：

```ts
@Injection('config')
private readonly config: {
  url: string;
};
```
