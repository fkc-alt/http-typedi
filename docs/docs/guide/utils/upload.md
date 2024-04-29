# 文件上传

`Http-Typedi`对上传做了很多包装，并导出了诸多方法（`base64`、`二进制`、`分片`）等上传方式

::: tip
当您使用的时候，只需要导入`UploadService`工具类并注入到应用程序即可。
:::

## 二进制上传

现在我们可以在 `UploadController` 中添加一个简单的（`二进制`）上传接口。我们使用 `Http-Typedi` 包提供的 `UploadService`来实现上传接口。

> upload.controller.ts

```ts{10}
import { RequestConfig, UploadService, PostMapping } from 'http-typedi'

interface TUploadFile {
  file: File
  id: number
}

@Controller('/upload')
export class UploadController {
  constructor(readonly uploadService: UploadService)
  @PostMapping('file')
  async uploadFile<T = TUploadFile>(configure: RequestConfig<T>) {
    return await this.uploadService.uploadFile<T, Record<string, any>>(
      <RequestConfig<T>>configure
    )
  }
}
```

以上代码客户端直接调用`uploadFile`会直接把`file`和`id`一并上传至服务端,客户端直接传入选中的 file 对象即可，如有其它参数需要将数据发送至服务端可参考本例进行配置

## base64 上传

现在我们可以在 `UploadController` 中添加一个简单的（`base64`）上传接口。我们使用 `Http-Typedi` 包提供的 `UploadService`来实现上传接口。

> upload.controller.ts

```ts{10}
import { RequestConfig, UploadService, PostMapping } from 'http-typedi'

interface TUploadFile {
  file: File
  id: number
}

@Controller('/upload')
export class UploadController {
  constructor(readonly uploadService: UploadService)
  @PostMapping('file')
  async uploadFile<T = TUploadFile>(configure: RequestConfig<T>) {
    return await this.uploadService.uploadBase64<T, Record<string, any>>(
      <RequestConfig<T>>configure
    )
  }
}
```

以上代码客户端直接调用`uploadBase64`会直接把`file`和`id`进行处理一并上传至服务端,
客户端直接传入选中的 file 对象即可，如有其它参数需要将数据发送至服务端可参考本例进行配置
