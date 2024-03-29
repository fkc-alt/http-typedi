# Middleware

中间件是一个称为 **before** 路由处理程序的函数。 中间件函数可以访问 **request** 和 **response** 对象，以及应用请求-响应周期中的 `next()` 中间件函数。 **next** 中间件函数通常由名为 `next` 的变量表示。

![图1](https://nest.nodejs.cn/assets/Middlewares_1.png)


:::tip
+ 中间件函数可以执行以下任务：
* 执行任何代码。
- 更改请求和响应对象。
+ 结束请求-响应循环。
* 调用堆栈中的下一个中间件函数。
- 如果当前中间件函数没有结束请求-响应循环，它必须调用 `next()` 将控制权传递给下一个中间件函数。 否则，请求将被挂起。
:::
