# useSelectedLayoutSegments

[原文->](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments)

`useSelectedLayoutSegments`是一个客户端组件挂钩，用于读取调用它的布局下方的激活路由片段。
它对于在需要了解激活子片段（如面包屑）的父布局中创建UI非常有用。

```javascript
// app/example-client-component.tsx

'use client'
 
import { useSelectedLayoutSegments } from 'next/navigation'
 
export default function ExampleClientComponent() {
  const segments = useSelectedLayoutSegments()
 
  return (
    <ul>
      {segments.map((segment, index) => (
        <li key={index}>{segment}</li>
      ))}
    </ul>
  )
}
```

> 小贴士：
> 
> - 由于`useSelectedLayoutSegments`是一个[客户端组件](../../01_创建应用/2_Rending(渲染)/2_client_components.md)挂钩，默认情况下布局是[服务器组件](../../01_创建应用/2_Rending(渲染)/1_server_components.md)，因此`useSelectedLayoutSections`通常是通过导入到布局中的客户端组件调用的。
> - 返回的分段包括您可能不希望包含在UI中的[路由组(Route Groups)](../../01_创建应用/1_Routing(路由)/7_Route_Groups.md)。您可以使用`filter()`数组方法删除以括号开头的项。

## 参数

```javascript
const segments = useSelectedLayoutSegments(parallelRoutesKey?: string)
```

`useSelectedLayoutSegments`可选地接受一个[`paralleRoutesKey`](../../1_Routing(路由)/10_Parallel_Routes.md#useselectedlayoutsegments)，它允许您读取该插槽中的`激活路由片段(active route segment)`。

## 返回值

`useSelectedLayoutSegments`返回一个字符串数组，其中包含从调用钩子的布局向下一级的激活片段(active segment)。或者，如果不存在，则为空数组。
例如，给定下面的布局和URL，返回的片段将是：

| Layout          | Visited URL | Returned Segments |
| --------------- | ----------- | ----------------- |
| `app/layout.js` | /            |            []       |
|  `app/layout.js`               |   `/dashboard `         |      `['dashboard']`             |
|  `app/layout.js`               |   `/dashboard/settings `         | `['dashboard', 'settings']`                  |
|  `app/dashboard/layout.js`               |   `/dashboard`          |           `[]`       |
|  `app/dashboard/layout.js`                 |   `/dashboard/settings `         |     `['settings']`              |

