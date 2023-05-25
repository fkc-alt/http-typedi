# 依赖注入

提供者也可以注入到模块(类)中（例如，用于配置目的）：

> demo.module.ts

```ts{10}
import { Module } from 'http-typedi'
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

@Module({
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {
  constructor(private readonly demoService: DemoService) {}
}
```

但是，由于`循环依赖性`，模块类不能注入到提供者中。