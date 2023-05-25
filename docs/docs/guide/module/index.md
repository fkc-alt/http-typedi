# 模块

模块是具有 `@Module()` 装饰器的类。 `@Module()` 装饰器提供了元数据，`http-typedi` 用它来组织应用程序结构。

![图1](https://docs.nestjs.com/assets/Shared_Module_1.png)

每个 http-typedi 应用程序至少有一个模块，即根模块。根模块是 http-typedi 开始安排应用程序树的地方。事实上，根模块可能是应用程序中唯一的模块，特别是当应用程序很小时，但是对于大型程序来说这是没有意义的。在大多数情况下，您将拥有多个模块，每个模块都有一组紧密相关的**功能**。

`@Module()` 装饰器接受一个描述模块属性的对象：

| providers         | 由 http-typedi 注入器实例化的提供者，并且可以至少在整个模块中共享 |
| ----------------- | :-------------------------------------------------------:|
| controllers       | 必须创建的一组控制器                                         |
| imports           | 导入模块的列表，这些模块导出了此模块中所需提供者                 |
| exports           | 由本模块提供并应在其他模块中可用的提供者的子集。                 |

默认情况下，该模块**封装**提供程序。这意味着无法注入既不是当前模块的直接组成部分，也不是从导入的模块导出的提供程序。因此，您可以将从模块导出的提供程序视为模块的公共接口或API。