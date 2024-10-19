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

“App Router”在一个名叫`app`的新路径下面有效。`app`程序目录与页面目录一起工作，以允许增量采用。这个使你可以选择你应用程序中的一些路由让他们有有一些新能力，同时保持其他在`pages`下的路由保持原来的能力；如果你的应用使用了`pages`目录，请查看[Pages Router](https://nextjs.org/docs/pages/building-your-application/routing)文档

> 小贴士："App Router"比"Pages Router"的优先级高。目录路由不会解析两个相同URL的路径，并且这将会造成编译时错误

![1729302264277](images/1_Defining_Routes/1729302264277.png)

默认情况下，在 `app`下面的组件默认都是[React服务端组件](../2_Rending(渲染)/1_server_components.md)，这个是一个性能优化方案并且可以让你更加容易的采纳他们，当然你也可以使用[客户端组件](../2_Rending(渲染)/2_client_components.md)
