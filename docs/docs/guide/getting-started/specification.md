# 开发规范

:::tip
强烈建议按照此规范来生成文件并编写代码，以便您可以更轻松地在不同的应用程序之间切换。
:::

```
HTTPClient
 ├── app.controller.ts
 ├── app.module.ts
 ├── app.service.ts
 └── main.ts
```

以下是这些核心文件的简要概述：

| filename          | description                                              |
| ----------------- | :-----------:                                            |
| app.controller.ts | 带有单个路由的基本控制器示例。                                |
| app.module.ts     | 应用程序的根模块。                                          |
| app.service.ts    | 带有单个方法的基本服务                                       |
| main.ts           | 应用程序入口文件。它使用 HttpFactory 用来创建 Http 应用实例。   |