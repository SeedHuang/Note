# 连接和导航（Linking和Navigating）

在Next.js有四种方法在路由之间导航

- 使用`<Link>`Component
- 使用`useRounter`钩子(客户端钩子)
- 使用`redirect`方法(服务端方法)
- 使用原生的`History API`

本篇将介绍这些功能，并且深度剖析Naviation的工作原理

## `Link`组件

`Link`是一个扩展子HTML`<a>`标签的内建组件，它可以提供[预取(perfetching)](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)以及在客户端路由之间的导航。这是一个在Next.js中路由跳转表推荐的方法；

你可以通过引入`next/link`以及赋值这个组件的`href`的属性来使用它。

```javascript
// app/page.tsx
import Link from 'next/link'
 
export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

其他相关属性请参照[Link的API文档](https://nextjs.org/docs/app/api-reference/components/link)

## 列子

### 链接到动态片段

当连接到[动态片段](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)，你可以使用[模板文字和插值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals)来创建链接列表，比如，生产一个博客列表

```javascript
// app/blog/PostList.js
import Link from 'next/link'
 
export default function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}

```

### 检查激活链接

你可以使用[usePathname()](https://nextjs.org/docs/app/api-reference/functions/use-pathname)来判断一个链接是否激活，比如，要在一个激活链接上添加一个class，你可以检查当前的`pathname`是否和link的`href`相符：

```javascript
'use client'
 
import { usePathname } from 'next/navigation'
import Link from 'next/link'
 
export function Links() {
  const pathname = usePathname()
 
  return (
    <nav>
      <ul>
        <li>
          <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
            Home
          </Link>
        </li>
        <li>
          <Link
            className={`link ${pathname === '/about' ? 'active' : ''}`}
            href="/about"
          >
            About
          </Link>
        </li>
      </ul>
    </nav>
  )
}// app/components/links.tsx
```

### 滚动到一个`id`
