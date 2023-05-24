# 运行应用程序


`main.ts` 它负责引导我们的应用程序：

> main.ts

```ts
import { HttpFactory } from 'http-typedi'
import { AppModule } from './app.module'

function createHTTPClient() {
  const HTTPClient = HttpFactory.create(AppModule)
  return HTTPClient
}
const HTTPClient = createHTTPClient()

```