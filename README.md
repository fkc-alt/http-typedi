# React-admin

# 介绍
```
   React-admin 是一个基于 React 的管理系统框架。
   主要作用是为了更好的构建一个基础的管理系统。
   该框架主要使用的技术包含React全家桶、Mock、Antd,配置了eslint和husky，充分保障了代码质量，以及git commit时的规范管理。
   实现了权限路由以及redux的状态管理，并且路由采用了自动化导入的功能。仅需配置无需再次引入。
```
---

***如果你也喜欢开源，如果你也喜欢这个项目请留下你的 Star 🌟，你们的 🌟 是对作者最大的鼓励，或者留下你的代码我们一起让他变得更好~~~***

---

### **项目预览**

---

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f12ad0dc8f834b02bc131c4ec4045712~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

---


## **路由使用**
如：新增一个 Excel页面 然后在pages下面建立Excel/index.jsx文件，然后在router文件夹下的modules下建立Excel/index.js引入Excel/index.jsx文件并导出即可。Component参数应为组件，可以不传递props参数。如果需要配置权限路由的话，则添加role字段配置即可，类型为数组。

{ps}:（props包含的参数有路由元信息，如需要获取路由元信息，则就配置props，本路由表配置经过二次封装，可以直接使用，如有使用上的问题，烦请咨询作者，切勿改动代码）

```javascript
  [{
    hidden: false,
    key: "/",
    label: "Excel",
    path: "/",
    icon: <DesktopOutlined />,
    Component: (props) => <Excel {...props} />,
    role: [Owner, Admin, OP], // 此处为权限配置开关(可配置多个权限，不需要则可以注释，或者为空数组)
  }]
```

---


## Git 使用规范

可参照例子以正确姿势编写commit message

------

```

# 提交格式（注意冒号后面有空格）
# git commit -m <type>[optional scope]: <description>

# type ：用于表明我们这次提交的改动类型，是新增了功能？还是修改了测试代码？又或者是更新了文档？ 

# optional scope：一个可选的修改范围。用于标识此次提交主要涉及到代码中哪个模块。

# description：一句话描述此次提交的主要内容，做到言简意赅。


#   常用的 type 类型
        # 类型	描述
        # build	编译相关的修改，例如发布版本、对项目构建或者依赖的改动
        # chore	其他修改, 比如改变构建流程、或者增加依赖库、工具等
        # ci	持续集成修改
        # docs	文档修改
        # feat	新特性、新功能
        # fix	修改bug
        # perf	优化相关，比如提升性能、体验
        # refactor	代码重构
        # revert	回滚到上一个版本
        # style	代码格式修改, 注意不是 css 修改
        # test	测试用例修改
#   例:
#   git commit -m 'fix(account): 修复xxx的bug'
#   git commit -m 'refactor: 重构整个项目'
```





## 环境配置说明

```
   REACT_APP_ORIGIN = http://localhost:3000
   REACT_APP_API = /rsapi
   //如果需要其他配置可自行添加，必须REACT_APP开头命名！
```

# project init
---
```
   npm install
   npm start
```

---
# build
```
   npm run build
```

---

