# 安装

## NPM

你可以通过[npm](https://github.com/fkc-alt/http-typedi/blob/main/LICENSE) 或 [yarn](https://github.com/fkc-alt/http-typedi) 引入并使用Http-Typedi

```sh
npm install http-typedi@latest
# or
yarn add http-typedi@latest
# or
pnpm install http-typedi@latest
```

:::tip 
由于Http-Typedi使用了依赖注入设计模式，因此需要安装`reflect-metadata`，并且需要在项目入口文件中引入`reflect-metadata`，如下所示：
:::

```sh
npm install reflect-metadata --save
```

```ts
// main.ts
import 'reflect-metadata'
```

:::tip
 如果使用Vite进行构建，还需要安装`@swc/core` `unplugin-swc`，如下所示：
:::

```sh
npm install @swc/core unplugin-swc --save
```

> vite.config.ts
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Swc from 'unplugin-swc'

export default defineConfig(() => {
  return {
    plugins: [Swc.vite()]
  }
})
```

:::tip
如果您的`package.json`中的`"type": "module"`为的话，需要去掉`"type": "module"`, 重新运行即可。详情可见[`issue`](https://github.com/fkc-alt/http-typedi/issues/2)
:::

::: warning
基于`Webpack`构建程序目前暂无在文档标注使用方法，后续会在文档更新。
:::