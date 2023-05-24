# 内置管道

- `ParseIntPipe`
+ `ParseFloatPipe`
* `ParseBoolPipe`
+ `DefaultValuePipe`
- `ValidationPipe`

他们从 `http-typedi` 包中导出。

我们先来快速看看如何使用`ParseIntPipe`。这是一个**转换**的应用场景。在本章后面，我们将展示 `ParseIntPipe` 的简单自定义实现。下面的示例写法也适用于其他内置转换管道（`ParseBoolPipe`、`ParseFloatPipe`，我们在本章中将其称为 `Parse*` 管道）。

