# 并行路由(Parallel Routes)

[原文->](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)

并行路由允许您在同一布局中同时或有条件地渲染一个或多个页面。它们对于应用程序的高度动态部分非常有用，例如社交网站上的仪表板和提要。

例如，考虑到仪表板，您可以使用并行路由同时呈现`team`和`analytics`页面：

![1729776963614](images/10_Parallel_Routes/1729776963614.png)

## 插槽(Slots)

使用命名**slots**建平行路线。插槽是用`@folder`约定定义的。例如，以下文件结构定义了两个插槽：`@analytics`和`@team`：

![1729777122160](images/10_Parallel_Routes/1729777122160.png)

插槽作为属性`props`传递给共享父布局。对于上面的例子，`app/layout.js`中的组件现在接受`@analytics`和`@team` slots道具，并可以与`children`道具并行渲染它们：

```javascript
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  )
}
```

但是，插槽`slots`不是`route segments`，也不影响URL结构。例如，对于`/@analytics/views`，URL将是`/views`，因为`@analytics`是一个插槽。插槽与常规页面组件组合在一起，形成与路由片段相关的最终页面。因此，在同一路由片段级别上不能有单独的静态和动态插槽。如果一个插槽是动态的，则该级别的所有插槽都必须是动态的。

> 小贴士
> 
> - `children`属性具是一个隐式插槽，不需要映射到文件夹。这意味着`app/page.js`相当于`app/@children/page.js`。

## 活动状态和导航(Active state and navigation)

默认情况下，Next.js会跟踪每个插槽的活动状态（或子页面）。但是，在插槽中呈现的内容将取决于导航类型：

[软导航(Soft Navigation)](./3_Linking_And_Navigating.md#3_Linking_And_Navigating.md#5-软导航soft-navigation)：在客户端导航期间，Next.js将执行部分渲染，更改插槽内的子页面，同时保持其他插槽的活动子页面，即使它们与当前URL不匹配。

硬导航(hard Navigation)：在整个页面加载（浏览器刷新）后，Next.js无法确定与当前URL不匹配的插槽的活动状态。相反，它将为不匹配的槽呈现一个[`default.js`](#defaultjs)文件，如果`default.js`不存在，则呈现404。

> 小贴士：
> 
> - 404 对于无合适的路由是有助于确保您不会意外地在页面上呈现非预期的并行路由。

### `default.js`

您可以定义一个default.js文件，作为初始加载或全页面重新加载期间不匹配插槽的回退。

![1729837959678](images/10_Parallel_Routes/1729837959678.png)

当导航到`/settings`时，`@team`插槽将呈现`/settings`页面，同时保持`@analytics`插槽的当前活动页面。
刷新后，Next.js将为`@analytics`渲染一个`default.js`。如果default.js不存在，则呈现404。
此外，由于children是一个隐式插槽，当Next.js无法恢复父页面的活动状态时，您还需要创建一个default.js文件来为children呈现回退。

### `useSelectedLayoutSegment(s)`

[`usedLayoutSegment`](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment)和[`usedLayoutSegments`](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments)都接受`parallelRoutesKey`参数，该参数允许您读取插槽内的活动路由片段(active route segment)。

```javascript
// app/layout.tsx

'use client'
 
import { useSelectedLayoutSegment } from 'next/navigation'
 
export default function Layout({ auth }: { auth: React.ReactNode }) {
  const loginSegment = useSelectedLayoutSegment('auth')
  // ...
}
```

