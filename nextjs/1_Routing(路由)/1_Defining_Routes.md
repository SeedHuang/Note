# 定义路由

每个应用的骨架就是路由，本篇将为你介绍web路由的基础概念以及如何在Next.js中处理路由；

## 术语(Terminology)

首先，你将看到以下词汇贯穿整个文章

![1729172932368](images/1_Defining_Routes/1729172932368.png)

- Tree（树）：是可视化层次结构的惯例。例如，包含父组件和子组件的组件树、文件夹结构等。
- SubTree（子树）：是树的一部分，一个新的根(Root)为开始以一个叶子(Leaf)结点未结束；
- Root（根）：一个树或者子树的第一个节点，比如Root Layout
- Leaf（叶子）：在子树中的节点，他没有其他子节点，比如下面图中，URL的最后一段

  ![1729174617809](images/1_Defining_Routes/1729174617809.png)

### `app` 路由

在Next.js 13版本中引入了一个基于React服务端组件的新App Router，他支持共享layout，内嵌路由，加载状态，错误处理等；

“App Router”在一个名叫 `app`的新路径下面有效。`app`程序目录与页面目录一起工作，以允许增量采用。这个使你可以选择你应用程序中的一些路由让他们有有一些新能力，同时保持其他在 `pages`下的路由保持原来的能力；如果你的应用使用了 `pages`目录，请查看[Pages Router](https://nextjs.org/docs/pages/building-your-application/routing)文档

> 小贴士："App Router"比"Pages Router"的优先级高。目录路由不会解析两个相同URL的路径，并且这将会造成编译时错误

![1729302264277](images/1_Defining_Routes/1729302264277.png)

默认情况下，在 `app`下面的组件默认都是[React服务端组件](../2_Rending(渲染)/1_server_components.md)，这个是一个性能优化方案并且可以让你更加容易的采纳他们，当然你也可以使用[客户端组件](../2_Rending(渲染)/2_client_components.md)

## 文件夹和文件的角色

Next.js使用了一种基于文件系统的路由：

- 文件夹用来定义路由。一个路由是一个独立的内嵌文件夹，之后文件夹到最终叶子文件夹的文件系统层级结构包含了一个 `page.js`文件。
- 文件使用来创建路由片段中的界面，详情请看[特殊文件](https://nextjs.org/docs/app/building-your-application/routing#file-conventions)

## 路由片段

每个在路由中的文件夹都代表了一个路由片段。每个路由片段都映射都到URL路径上的一个相应片段

![1729304141209](images/1_Defining_Routes/1729304141209.png)

内嵌路由

要创建一个内嵌路由，你可以在每个文件夹下面内嵌一个文件夹。举例子，你可以通过在 `app`路径下内嵌两个文件夹来添加 `/dashboard/settings`的新路由

这个 `/dashboard/settings`路由是由三个片段组成的

- `/`： 根片段
- `dashboard`：片段
- `settings`：叶子片段

## 文件协议

Next.js提供了一组在内嵌路由中创建指定行为UI的特殊文件：

| special file | specific behavior                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------- |
| layout       | 为片段(segment)和他的子页面共享UI                                                              |
| page         | 一个路由的唯一UI，是该路由可以被访问                                                           |
| loading      | 一个路由和他的子路由的加载界面                                                                 |
| not-found    | 一个路由和他的子路由的404界面                                                                  |
| error        | 一个路由和他的子路由的错误界面                                                                 |
| global-error | 全局错误UI                                                                                     |
| route        | 服务端API终端                                                                                  |
| template     | 专门的重新渲染布局UI                                                                           |
| default      | [并行路由](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)的回退UI |

> 小贴士：`.js`，`.jsx`，`.tsx`文件后缀名可以被用作特殊文件

## 组件层次

在一个路由片段中的特殊文件中定义的React组件会在一个专门的层次结构中被渲染；

- `layout.js`
- `template.js`
- `error.js`: React 错误边界
- `loading.js`: React suspense边界
- `not-found.js`：React 错误边界
- `page.js`或者内嵌 `layout.js`

![1729305955125](images/1_Defining_Routes/1729305955125.png)

在内嵌路由中，一片段的组件将会内嵌在它服务片段的组件中

![1729306107506](images/1_Defining_Routes/1729306107506.png)

## 托管（Coloaction）

除了特殊文件，你还要选择托管 `app`路径下文件夹中你自己的文件(比如： 组件，样式，测试等)

这是因为当文件夹被定义为路由，只有 `page.js`或者 `route.js`的内容可以被访问；

![1729307467105](images/1_Defining_Routes/1729307467105.png)

想了解更多，请查阅项目[组织和托管](https://nextjs.org/docs/app/building-your-application/routing/colocation)

## 高级路由模式

App Router提供了一组协议来帮助你实现更加高级的路由模式，包括：

- [Parallel Routes(平行路由)](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)：允许你在同一个视图中同时显示两个或更多原本可以独立访问的页面。你可以将它们用作具有子导航的分割视图，比如DashBoard

- [Intercepting Routes(拦截路由)](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)：允许拦截一个路由，并在另外一个路由的上下文中显示他。当保持当前页面的上下文很重要时你可以使用拦截路由。例如：在编辑一个任务或展开提要中的图片时查看所有任务。

这些模式允许你搭建更加粉丰富和复杂的界面
