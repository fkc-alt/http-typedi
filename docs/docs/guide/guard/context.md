# 执行上下文

**`canActivate()`** 函数接收单个参数 **`ExecutionContext`** 实例。**`ExecutionContext`** 继承自 **`ArgumentsHost`** 。在异常过滤器章节，**`我们讲到过 ArgumentsHost`**。在上面的示例中，我们只是使用了之前在 **`ArgumentsHost`**上定义的帮助器方法来获得对请求对象的引用。有关此主题的更多信息。你可以在这里了解到更多(在异常过滤器章节)。

**`ExecutionContext`** 提供了更多功能，它扩展了 **`ArgumentsHost`**，但是也提供了有关当前执行进程的更多详细信息。这些细节有助于构建更通用的守卫，这些守卫可以在一系列的控制器、方法和执行上下文中工作。在这里了解有关 **`ExecutionContext`** 的更多信息。