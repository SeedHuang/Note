[原文->](https://nextjs.org/docs/app/building-your-application/routing/route-groups)

# 路由组(Route Groups)

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

#### 在layout中选择一个专门的片段；

要在布局中选择特定路线，请创建一个新的`Route Group`（例如：商店），并将共享相同`layout`的路线移动到组中（例如帐户和购物车）。组外的路线将不共享`layout`（例如结账）。

![1729676118435](images/7_Route_Groups/1729676118435.png)

#### 选择在一个专门的路由上加载骨架图(Opting for loading skeletons on a specific route)

在一个专门的路由上通过添加一个`loading.js`来加载骨架图，创建一个新的`route group`(如：`/(overview)`)并且将你的`loading.tsx`移动到`route group`。

![1729676475134](images/7_Route_Groups/1729676475134.png)

现在，这个`loading.tsx`文件将仅应用于你的`dashboard/overview`路由组下面的页面，而不是dashboard下所有页面，而这种方式将不会影响URL路径的结构；
