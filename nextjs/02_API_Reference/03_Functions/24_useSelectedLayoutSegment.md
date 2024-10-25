# useSelectedLayoutSegment

[原文->](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment)

`useSelectedLayoutSegment`是一个客户端组件钩子，它允许您读取调用它的布局下方一层的活动路由片段。
它对导航UI很有用，例如父布局中的选项卡，这些选项卡会根据活动的子段更改样式。

```javascript
// app/example-client-component.tsx

'use client'
 
import { useSelectedLayoutSegment } from 'next/navigation'
 
export default function ExampleClientComponent() {
  const segment = useSelectedLayoutSegment()
 
  return <p>Active segment: {segment}</p>
}
```

> 小贴士：
> 
> - 由于`useSelectedLayoutSegment`是一个客户端组件挂钩，默认情况下布局是服务器组件，因此`useSelectedLayoutSection`通常是通过导入到布局中的客户端组件调用的。
> - `useSelectedLayoutSegment`只返回下一级的片段。要返回所有活动段，请参阅[useSelectedLayoutSegments](./useSelectedLayoutSegments.md)

## 参数：

```javascript
const segment = useSelectedLayoutSegment(parallelRoutesKey?: string)
```

`useSelectedLayoutSegment`可选地接受一个[`parallelRoutesKey`](../../01_创建应用/1_Routing(路由)/10_Parallel_Routes.md#useselectedlayoutsegments)，它允许您读取该插槽中的活动路由片段。

