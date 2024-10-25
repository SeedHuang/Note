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

## 返回值

`useSelectedLayoutSegment`返回活动路由片的字符串，若不存在，则返回null。

例如，给定下面的布局和URL，返回的片段将是：


| Layout                    | Visited URL                  | Returned Segment |
| ------------------------- | ---------------------------- | ---------------- |
| `app/layout.js`           | /                            | null             |
| `app/layout.js`           | /dashboard                   | `'dashboard'`    |
| `app/dashboard/layout.js` | /dashboard                   | `null`           |
| `app/dashboard/layout.js` | /dashboard/settings          | `'settings'`     |
| `app/dashboard/layout.js` | /dashboard/analytics         | `'analytics'`    |
| `app/dashboard/layout.js` | /dashboard/analytics/monthly | `'analytics'`    |


## 举例

### 创建活动`<Link>`组件(Creating an active `<Link>` component)

您可以使用`usedLayoutSegment`创建活动`<Link>`组件，该组件会根据活动片段更改样式。例如，博客侧边栏中的特色帖子列表：

```javascript
// app/blog/blog-nav-link.tsx

'use client'
 
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
 
// This *client* component will be imported into a blog layout
export default function BlogNavLink({
  slug,
  children,
}: {
  slug: string
  children: React.ReactNode
}) {
  // Navigating to `/blog/hello-world` will return 'hello-world'
  // for the selected layout segment
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment
 
  return (
    <Link
      href={`/blog/${slug}`}
      // Change style depending on whether the link is active
      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
    >
      {children}
    </Link>
  )
}
```

```javascript
// app/blog/layout.tsx

// Import the Client Component into a parent Layout (Server Component)
import { BlogNavLink } from './blog-nav-link'
import getFeaturedPosts from './get-featured-posts'
 
export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const featuredPosts = await getFeaturedPosts()
  return (
    <div>
      {featuredPosts.map((post) => (
        <div key={post.id}>
          <BlogNavLink slug={post.slug}>{post.title}</BlogNavLink>
        </div>
      ))}
      <div>{children}</div>
    </div>
  )
}
```
