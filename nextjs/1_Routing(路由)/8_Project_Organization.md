# 项目组织和文件托管(Project Organization and File Colocation)

[原文->](https://nextjs.org/docs/app/building-your-application/routing/colocation)

除了路由[文件夹(routing folder)和文件约定(file conventions)](https://nextjs.org/docs/getting-started/project-structure#app-routing-conventions)外，Next.js对如何组织和托管项目文件没有异议。

此页面共享可用于组织项目的默认行为和功能。

- 默认情况下安全托管(Safe colocation by default)
- 项目组织特点(Project organization features)
- 项目组织策略(Project organization strategies)

## 默认情况下安全托管(Safe colocation by default)

在`app`目录中，嵌套文件夹层次结构定义了路由结构。

每个文件夹代表一个路由片段，该路由段映射到URL路径中的相应段。

然而，虽然路由结构是通过文件夹定义的，一个文件在被添加`page.js`或者`route.js`之前他的路由片段是无法被公开访问的；

![1729690064497](images/8_Project_Organization/1729690064497.png)

并且，就算一个路由可以被公开访问，只有`page.js`或`route.js`返回的内容才会发送到客户端。

![1729690187639](images/8_Project_Organization/1729690187639.png)

这意味着项目文件可以安全地托管在应用程序目录中的路由片段内，而不会意外路由。

![1729690288987](images/8_Project_Organization/1729690288987.png)

> 小贴士：
>
> - 这与`pages`目录不同，在`pages`目录中，任何文件都被视为路由。
> - 虽然你可以在`app`中托管你的项目文件，但你不必这样做。如果你愿意，你可以把它们放在`app`目录之外。

## 项目组织特点(Project organization features)

Next.js提供了许多新特性来帮助你组织你的项目。

### 私有文件夹(Private Folders)

私有文件夹可以通过一个下划线前缀被创建，比如说这样`_folderName`。

这表示该文件夹是私有实现细节，路由系统不应考虑它，从而将该文件夹及其所有子文件夹从路由中排除。

![1729690642399](images/8_Project_Organization/1729690642399.png)

由于默认情况下`app`目录中的文件可以安全地托管，因此托管不需要私人文件夹。然而，它们可能对以下方面有用：

- 将UI逻辑和路由逻辑分离
- 在项目和Next.js生态系统中持续组织内部文件。
- 在代码编辑器中对文件进行排序和分组。
- 避免与未来Next.js文件约定的潜在命名冲突。

> 小贴士：
>
> - 虽然不是框架约定，但您也可以考虑使用相同的下划线模式将私人文件夹外的文件标记为“私人”。
> - 您可以通过在文件夹名称前加上%5F（下划线的URL编码形式）来创建以下划线开头的URL段：%5FfolderName。
> - 如果你不使用私人文件夹，了解Next.js的特殊文件约定以防止意外的命名冲突会有所帮助。

### 路由组(Route Groups)

可以通过将文件夹括在括号中来创建路由组：(folderName)

这表示该文件夹用于组织目的，不应包含在路由的URL路径中。

![1729691022140](images/8_Project_Organization/1729691022140.png)

`Route groups`可用于：

- [将路线组织成组](./7_Route_Groups.md#例子)，例如按现场部分、意图或团队。
- 在同一级路由片段启用嵌套布局：

  - [在同一段中创建多个嵌套布局，包括多个根布局](./7_Route_Groups.md#创建多个root-layoutcreating-multiple-root-layouts)
  - [向公共管段中的管线子集添加布局](./7_Route_Groups.md#在layout中选择一个专门的片段opting-specific-segments-into-a-layout)

### `src`目录(src directory)

Next.js支持将`app`代码（包括app）存储在可选的`src`目录中。这将应用程序代码与主要位于项目根目录中的项目配置文件分开。

![1729771698500](images/8_Project_Organization/1729771698500.png)

### 模块路径别名(Module Path Aliases)

Next.js支持[模块路径别名](https://nextjs.org/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases)，这使得跨深度嵌套的项目文件读取和维护导入变得更加容易。

```javascript
// app/dashboard/settings/analytics/page.js
// before
import { Button } from '../../../components/button'
 
// after
import { Button } from '@/components/button'
```

## 项目组织策略(Project organization strategies)

在Next.js项目中组织自己的文件和文件夹时，没有“正确”或“错误”的方式。
以下部分列出了常见策略的高层次概述。最简单的收获是选择一个适合你和你的团队的策略，并在整个项目中保持一致。

> 小贴士：在下面的示例中，我们使用组件和库文件夹作为通用占位符，它们的命名没有特殊的框架意义，您的项目可能会使用其他文件夹，如ui、utils、hook、styles等。

### 将项目文件存储在`app`之外(Store project files outside of `app`)

此策略将所有应用程序代码存储在项目根目录的共享文件夹中，并将应用程序目录纯粹用于路由目的。

![1729772164383](images/8_Project_Organization/1729772164383.png)

### 将项目文件存储在`app`内的顶级文件夹中(Store project files in top-level folders inside of `app`)

此策略将所有应用程序代码存储在`app`目录根的共享文件夹中。

![1729772298282](images/8_Project_Organization/1729772298282.png)

### 按要素或路由拆分项目文件(Split project files by feature or route)

此策略将全局共享的应用程序代码存储在根`app`目录中，并将更具体的应用程序编码拆分为使用它们的路由段。

![1729772442639](images/8_Project_Organization/1729772442639.png)
