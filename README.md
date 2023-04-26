# http-typedi

description: http Dependency Injection (HTTP 依赖注入)
# 介绍
 http-typedi 致力于书写更高效，可维护性强的TypeScript代码。
 由于实际业务中，封装的请求方法后期维护过于困难（如：时间很久，请求方法参数和参数类型遗忘）都给后期维护带来极大困扰，有时还需要向后端同事询问具体的接口约定。极大的浪费了开发时间，因此http-typedi的出现，就是为了解决这一痛点。
 <br />
 <br />

# 第一步

## Installation(安装)

```sh
npm install http-typedi --save
```

#### 以下是这些核心文件的简要概述：

| filename          | description                                                   |
| ----------------- | ------------------------------------------------------------- |
| app.controller.ts | 带有单个路由的基本控制器示例。                                |
| app.module.ts     | 应用程序的根模块。                                            |
| app.service.ts    | 带有单个方法的基本服务                                        |
| main.ts           | 应用程序入口文件。它使用 HttpFactory 用来创建 Http 应用实例。 |

#### main.ts 它负责引导我们的应用程序：

```typescript
import { HttpFactory } from 'http-typedi'
import { AppModule } from './app.module'

function bootstrap(): AppModule {
  const application = await HttpFactory.create(AppModule)
  return application
}
const application = bootstrap()
```

要创建一个 Http 请求应用实例，我们使用了**HttpFactory**核心类。**HttpFactory** 暴露了一些静态方法用于创建应用实例。 **create()** 方法返回一个实现 HttpServicesApplication<AppModule>接口的对象。该对象提供了一组可用的方法，我们会在后面的章节中对这些方法进行详细描述。 在上面的 main.ts 示例中，我们只是在程序中挂载上 HTTP 服务，让应用程序可以使用 HTTP 请求。

# 控制器

##### 控制器负责处理传入的参数并通过专属的服务提供者(**provider**)向服务端进行通信并返回响应。

##### 控制器的目的是接收应用的特定请求。**路由**机制控制哪个控制器接收哪些请求。通常，每个控制器有多个路由，不同的路由可以执行不同的操作。

##### 为了创建一个基本的控制器，我们使用类和**装饰器**。装饰器将类与所需的元数据相关联，并使 http-typedi 能够创建路由映射（将请求绑定到相应的控制器）。

# 路由

#### 使用路由前，需要创建一个 http 请求类，本例默认使用 axios 创建, 供其他 service 使用向服务端进行通信

> request.service.ts

```typescript
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Injectable } from 'http-typedi'

interface Response<T = unknown> {
  readonly code: number
  readonly message: string
  data: T
}

type ServerRes<T, U = Promise> = U extends Promise
  ? Promise<Response<T>>
  : Response<T>

@Injectable()
export default class RequestService {
  private _instance!: AxiosInstance
  /**
   * @method constructor
   */
  constructor() {
    this.forRoot()
  }
  public async request<T, U>(config: AxiosRequestConfig<T>): ServerRes<U> {
    return await this.instance.request<{}, ServerRes<U>, T>(config)
  }

  /**
   * @method forRoot
   * @param { AxiosRequestConfig } AxiosRequestConfig
   * @description Set Configure
   */
  public forRoot(config: AxiosRequestConfig = {}): void {
    this.instance = axios.create(config)
  }

  /**
   * @method getters
   * @return { AxiosInstance } AxiosInstance
   * @description instance Getter
   */
  private get instance(): AxiosInstance {
    return this._instance
  }

  /**
   * @method setters
   * @description instance Setter
   */
  private set instance(axiosInstance: AxiosInstance) {
    this._instance = axiosInstance
  }
}
```

我们还需要创建一个 Article 控制器的服务类通过注入 RequestService 进行和服务端的交互

> article.service.ts

```typescript
import { Injectable } from 'http-typedi'
import { AxiosRequestConfig } from 'axios'

export interface ArticleListReq {
  pageSize: number
  currentPage: number
}
export interface ArticleListRes {
  list: Object[]
}

@Injectable()
export default class ArticleService {
  constructor(public requestService: RequestService) {}
  public getArticleList<T = ArticleListReq, U = ArticleListRes>(
    configure: AxiosRequestConfig<T>
  )(configure: AxiosRequestConfig<T>): ServerRes<U> {
    return this.requestService.request<T, U>(configure)
  }
}

```

##### 最后我们使用 **@Controller()** 装饰器定义一个基本的控制器。可选 路由路径前缀设置为 **article**。在 **@Controller()** 装饰器中使用路径前缀可以使我们轻松地对一组相关的路由进行分组，并最大程度地减少重复代码。例如，我们可以选择将一组用于管理与 **/article** 下的文章实体进行互动的路由进行分组。这样，我们可以在 **@Controller()** 装饰器中指定路径前缀 **article**，这样就不必为文件中的每个路由重复路径的那部分。

> article.controller.ts

```typescript
import { Controller, Get } from 'http-typedi'
import { AxiosRequestConfig } from 'axios'
import ArticleService from './article.service.ts'
import type { ArticleListReq } from './article.service.ts'

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Get('list')
  getArticleList(confugre: ArticleListReq): ServerRes<ArticleListRes> {
    return this.articleService.getArticleList(<AxiosRequestConfig>confugre)
  }
}
```

在上面的示例中，用户通过调用**getArticleList**方法触发 **@Get('list')** 装饰器告诉 **http-typedi** 当前方法为需要和服务端进行通信的方法和请求路径。 什么是路由路径 ？ 一个处理程序的路由路径是通过连接为控制器 （Controller） 声明的（可选）前缀和请求装饰器中指定的任何路径来确定的。由于我们已经为当前的 Controller 声明了一个前缀，并且在请求装饰器（@Get('list')）中添加了**list**后缀，因此 http-typedi 会通过 **@Get('list')**装饰器进行处理并返回请求路径为 **/article/list**Route 路由并且携带请求参数调用 articleService 实例的 getArticleList 方法传入请求参数信息和服务端进行通信

# Headers

要指定自定义请求头，可以使用 @header() 装饰器

```typescript
import { Controller, Post, Header } from 'http-typedi'
import { AxiosRequestConfig } from 'axios'
import ArticleService from './article.service.ts'
import type { UpdateArticleReq } from './article.service.ts'
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Post()
  @Header('Cache-Control', 'none')
  updateArticle(confugre: UpdateArticleReq) {
    return this.articleService.updateArticle(<AxiosRequestConfig>confugre)
  }
}
```
tip: **Header** 需要从 **http-typedi** 包导入。

# 路由参数
当您需要接受动态数据 **（dynamic data）**作为请求的一部分时（例如，使用GET /article/articleDetail/1 来获取 id 为 1 的 articleDetail），带有静态路径的路由将无法工作。为了定义带参数的路由，我们可以在路由路径中添加路由参数标记（token）以捕获请求 URL 中该位置的动态值。下面的 @Get() 装饰器示例中的路由参数标记（route parameter token）演示了此用法

```typescript
import { Controller, Get } from 'http-typedi'
import { AxiosRequestConfig } from 'axios'
import ArticleService from './article.service.ts'
import type { ArticleDetailReq } from './article.service.ts'
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Get('articleDetail/:id')
  updateArticle(confugre: ArticleDetailReq) {
    return this.articleService.getArticleDetail(<AxiosRequestConfig>confugre)
  }
}
```
