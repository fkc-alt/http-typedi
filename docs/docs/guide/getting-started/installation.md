# 安装

## NPM

你可以通过[npm](https://github.com/fkc-alt/http-typedi/blob/main/LICENSE) 或 [yarn](https://github.com/fkc-alt/http-typedi) 或 [pnpm](https://github.com/fkc-alt/http-typedi) 引入并使用Http-Typedi

```sh
$ npm install http-typedi@latest
# or
$ yarn add http-typedi@latest
# or
$ pnpm install http-typedi@latest
```

:::tip 
由于Http-Typedi使用了依赖注入设计模式，因此需要安装`reflect-metadata`，并且需要在项目入口文件中引入`reflect-metadata`，如下所示：
:::

```sh
$ npm install reflect-metadata --save
```

```ts
// main.ts
import 'reflect-metadata'
```
:::warning 
TypeScript 中使用装饰器需要开启 experimentalDecorators 和 emitDecoratorMetadata选项，否则 reflect-metadata 提供的方法将无法获取参数类型信息。
:::
> tsconfig.json
```json
{
  "compilerOptions": {
    "target": "esnext", // [!code focus:3] // [!code ++:3]
    "module": "esnext", // [!code focus:3] // [!code ++:3]
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
  }
}
```

# vite
:::tip
 如果使用Vite进行构建，还需要安装`unplugin-swc`，如下所示：
:::

```sh
$ npm install unplugin-swc --save
```

> vite.config.ts
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Swc from 'unplugin-swc'  // [!code focus] // [!code ++]

export default defineConfig(() => {
  return {
    plugins: [Swc.vite()] // [!code focus] // [!code ++]
  }
})
```

:::warning
如果您的`package.json`中的`"type"`为`"module"`的话，需要去掉`"type": "module"`, 重新运行即可。详情可见[`issue`](https://github.com/fkc-alt/http-typedi/issues/2)
:::

那么现在就可以运行起来您的应用程序啦~

# webpack
:::tip
 如果使用webpack进行构建，需要安装一下`ts-loader`、`babel-loader`、`@babel/preset-env`、`@babel/plugin-proposal-decorators`这些包。
:::

```sh
$ npm install ts-loader babel-loader @babel/preset-env @babel/plugin-proposal-decorators --save-dev
```

还需要修改一下`webpack.config.js`中的`rules`，具体配置如下所示：


```javascript
const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: { // [!code focus:17] // [!code ++:17]
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [['@babel/plugin-proposal-decorators', { "legacy": true }]],
            },
          },
          'ts-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  ...
};
```
那么现在就可以运行起来您的应用程序啦~

