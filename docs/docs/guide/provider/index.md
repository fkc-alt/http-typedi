# Providers

Providers 是 `http-typedi` 的一个基本概念。 许多基本的 `http-typedi` 类可能被视为 provider - `service`或被`http-typedi`的`@Injectable()` 装饰之后的会被视为 provider - `service`,他们都可以通过 `constructor`**注入**依赖关系。 这意味着对象可以彼此创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给 `http-typedi`。 Provider 只是一个用 `@Injectable()` 装饰器注释的类。provider可以在 controller控制器中或其他的provider中使用。

在前面的章节中，我们已经创建了一个简单的控制器 `DemoController` 。控制器应处理 `HTTP` 请求并将更复杂的任务委托给 **providers**。`Providers` 是纯粹的 `JavaScript` 类，在其类声明之前带有 `@Injectable()`装饰器。

::: tip
由于 `http-typedi` 可以以更多的面向对象方式设计和组织依赖性，因此我们强烈建议遵循 [SOLID](https://en.wikipedia.org/wiki/SOLID) 原则。
:::