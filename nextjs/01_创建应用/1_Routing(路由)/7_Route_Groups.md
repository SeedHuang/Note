# 路由组(Route Groups)

[原文->](https://nextjs.org/docs/app/building-your-application/routing/route-groups)

在`app`目录下，嵌套文件夹通常会映射到URL的路径上。然而，你可以把一个文件夹标记为一个路由组(Route Group)文件夹被包含在路由的URL路径中。

这允许您将路线段和项目文件组织到逻辑组中，而不会影响URL路径结构。

路由组在以下场景下很有用：

- 将路线组织成组，例如按现场部分、意图或团队。
- 在同一管线段级别启用[嵌套布局](./2_Pages_and_Layout.md)：
  - 在同一段中创建多个嵌套布局，包括多个根布局
  - 向公共片段(common segment)中的片段子集添加布局
- 将装载骨架添加到公共段中的特定路线

## 意图(Convention)

可以通过将文件夹的名称括在括号中来创建路由组：(folderName)

### 例子

#### 在不影响URL路径的情况下组织路由(Organize routes without affecting the URL path)

在不影响URL的情况下组织路由，需要创建一个组，把相关路由放在下面。号中的文件夹将从URL中省略（例如（营销）或（商店）。

![1729671073575](images/7_Route_Groups/1729671073575.png)

即使（营销）和（商店）内的路由共享相同的URL层次结构，您也可以通过在它们的文件夹中添加layout.js文件为每个组创建不同的布局。

![1729671174421](images/7_Route_Groups/1729671174421.png)

#### 在layout中选择一个专门的片段(Opting specific segments into a layout)

要在布局中选择特定路线，请创建一个新的`Route Group`（例如：商店），并将共享相同`layout`的路线移动到组中（例如帐户和购物车）。组外的路线将不共享`layout`（例如结账）。

![1729676118435](images/7_Route_Groups/1729676118435.png)

#### 选择在一个专门的路由上加载骨架图(Opting for loading skeletons on a specific route)

在一个专门的路由上通过添加一个`loading.js`来加载骨架图，创建一个新的`route group`(如：`/(overview)`)并且将你的`loading.tsx`移动到`route group`。

![1729676475134](images/7_Route_Groups/1729676475134.png)

现在，这个`loading.tsx`文件将仅应用于你的`dashboard/overview`路由组下面的页面，而不是dashboard下所有页面，而这种方式将不会影响URL路径的结构；

#### 创建多个Root Layout(Creating multiple root layouts)

要创建多[Root Layout](./1_Defining_Routes.md#跟路由required-root-layout)，移除顶部`layout.js`文件，给每个`route group`中添加一个`layout.js`。这对于将应用程序划分为具有完全不同UI或体验的部分非常有用。`<html>`和`<body>`标签将被添加到每个Root layout中。

![1729678610403](images/7_Route_Groups/1729678610403.png)

上面的例子中，`(marketing)`和`(shop)`的路由组都有他们自己的`Root Layout`

> 小贴士
>
> - 路线组的命名除了组织外没有其他特殊意义。它们不会影响URL路径。
> - 包含路由组的路由不应解析为与其他路由相同的URL路径。例如，由于路由组不影响URL结构，`(marketing) /about/page.js`和`(shop) /about/page.js`都会解析为`/about`并导致错误。
> - 如果你使用多个根布局而没有顶级`layout.js`文件，你的主页.js文件应该在其中一个路由组中定义，例如：`app/ (marketing) /page.js`。
> - 在多个根布局之间导航将导致整个页面加载（与客户端导航相反）。例如，从使用`app/（shop）/layout.js`的/cart导航到使用`app/`。这仅适用于多个根布局。
