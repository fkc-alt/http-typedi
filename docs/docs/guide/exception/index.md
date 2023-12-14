# 内置 HTTP 异常
`Http-Typedi` 提供了一组继承自基 `HttpException` 的标准异常。 这些是从 `Http-Typedi` 包中公开的，代表了许多最常见的 HTTP 异常：

+ BadRequestException
- UnauthorizedException
- NotFoundException
+ ForbiddenException
- NotAcceptableException
+ RequestTimeoutException
- InternalServerErrorException
+ MethodNotAllowedException
+ GatewayTimeoutException

所有内置异常也可以使用 `options` 参数提供错误 `cause` 和错误描述：

```ts
throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Some error description' })
```

使用上面的内容，这就是响应的样子：

```json
{
  "message": "Something bad happened",
  "error": "Some error description",
  "statusCode": 400,
}
```