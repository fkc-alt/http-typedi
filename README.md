# http-typedi

<div class='package-flex' style='margin-bottom: 20px'>
  <a href='https://www.npmjs.com/package/http-typedi' target='_blank'>
    <img src="https://img.shields.io/bundlephobia/minzip/http-typedi/latest" alt="Size" />
  </a>
  <a href="https://www.npmjs.com/package/http-typedi">
    <img src="https://img.shields.io/npm/v/http-typedi" alt="Version" />
  </a>
  <a href='https://www.npmjs.com/package/http-typedi'>
    <img src='https://img.shields.io/github/languages/top/fkc-alt/http-typedi' alt='Languages' />
  </a>
  <a href='https://www.npmjs.com/package/http-typedi' target='_blank'>
    <img src='https://img.shields.io/npm/l/http-typedi' alt='License' />
  </a>
  <a href='https://github.com/fkc-alt/http-typedi' target='_blank'>
    <img src='https://img.shields.io/github/stars/fkc-alt' alt='Star' />
  </a>
  <a href='https://www.npmjs.com/package/http-typedi' target='_blank'>
    <img src='https://img.shields.io/npm/dm/http-typedi' alt='Download' />
  </a>
</div>

> HTTP Dependency Injection (HTTP 依赖注入)

## Table of Contents

- [Module](https://fkc-alt.github.io/http-typedi/guide/module/)
  - [Features](https://fkc-alt.github.io/http-typedi/guide/module/features)
  - [Share](https://fkc-alt.github.io/http-typedi/guide/module/share)
  - [DI](https://fkc-alt.github.io/http-typedi/guide/module/dependency-injection)
  - [Global](https://fkc-alt.github.io/http-typedi/guide/module/global)
+ [Controller](https://fkc-alt.github.io/http-typedi/guide/controller/)
  - [Router](https://fkc-alt.github.io/http-typedi/guide/controller/router)
  - [Resources](https://fkc-alt.github.io/http-typedi/guide/controller/resources)
  - [Headers](https://fkc-alt.github.io/http-typedi/guide/controller/headers)
  - [Version](https://fkc-alt.github.io/http-typedi/guide/controller/version)
  - [Sleep](https://fkc-alt.github.io/http-typedi/guide/controller/sleep)
  - [Router-Parameter](https://fkc-alt.github.io/http-typedi/guide/controller/router-parameter)
* [Injectable](https://fkc-alt.github.io/http-typedi/guide/provider/)
  - [Service](https://fkc-alt.github.io/http-typedi/guide/provider/service)
  - [DI](https://fkc-alt.github.io/http-typedi/guide/provider/dependency-injection)
  - [Optional](https://fkc-alt.github.io/http-typedi/guide/provider/optional)
  - [Attribute-DI](https://fkc-alt.github.io/http-typedi/guide/provider/attribute-di)
  - [Register-Provider](https://fkc-alt.github.io/http-typedi/guide/provider/register-provider)
- [Pipe](https://fkc-alt.github.io/http-typedi/guide/pipe/)
  - [Resources](https://fkc-alt.github.io/http-typedi/guide/pipe/resources)
  - [Bind](https://fkc-alt.github.io/http-typedi/guide/pipe/bind)
  - [Custom](https://fkc-alt.github.io/http-typedi/guide/pipe/custom)
+ [Decorators](https://fkc-alt.github.io/http-typedi/guide/decorators/Param-decorators)
  + [Param-Decorators](https://fkc-alt.github.io/http-typedi/guide/decorators/Param-decorators)
  + [Apply-Decorators](https://fkc-alt.github.io/http-typedi/guide/decorators/apply-decorators)
  + [Set-Metadata](https://fkc-alt.github.io/http-typedi/guide/decorators/set-metadata)
- [Interceptor](https://fkc-alt.github.io/http-typedi/guide/interceptor)
  - [UseInterceptorsReq](https://fkc-alt.github.io/http-typedi/guide/interceptor/use-interceptors-req)
  - [UseInterceptorsRes](https://fkc-alt.github.io/http-typedi/guide/interceptor/use-interceptors-res)
* [Catch](https://fkc-alt.github.io/http-typedi/guide/catch)
+ [DTO](https://fkc-alt.github.io/http-typedi/guide/support/what-is-dto)
  + [What-is-DTO](https://fkc-alt.github.io/http-typedi/guide/support/what-is-dto)
  + [DTO](https://fkc-alt.github.io/http-typedi/guide/support/dto)
- [GlobalConfig](https://fkc-alt.github.io/http-typedi/guide/global-config/)
  - [Global-Reflect](https://fkc-alt.github.io/http-typedi/guide/global-config/route-reflect)
  - [Global-Prefix](https://fkc-alt.github.io/http-typedi/guide/global-config/prefix)
  - [Global-Catch](https://fkc-alt.github.io/http-typedi/guide/global-config/catch)
  - [Global-UseInterceptors](https://fkc-alt.github.io/http-typedi/guide/global-config/use-interceptors)
  - [Global-Sleep](https://fkc-alt.github.io/http-typedi/guide/global-config/sleep)

## Installation

```sh
$ npm install http-typedi reflect-metadata --save
```

## Getting started
- 要查看中文 指南, 请访问 [https://fkc-alt.github.io/http-typedi](https://fkc-alt.github.io/http-typedi)📚
