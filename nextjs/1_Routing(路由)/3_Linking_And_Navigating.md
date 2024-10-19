# 连接和导航（Linking和Navigating）

在Next.js有四种方法在路由之间导航

- 使用`<Link>`Component
- 使用`useRounter`钩子(客户端钩子)
- 使用`redirect`方法(服务端方法)
- 使用原生的`History API`

本篇将介绍这些功能，并且深度剖析Naviation的工作原理

## `Link`组件(`<Link>` Component)

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

## 例子(Examples)

### 链接到动态片段(Linking to Dynamic Segments)

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

### 检查激活链接(Checking Active Links)

你可以使用[usePathname()](https://nextjs.org/docs/app/api-reference/functions/use-pathname)来判断一个链接是否激活，比如，要在一个激活链接上添加一个class，你可以检查当前的`pathname`是否和link的`href`相符：

```javascript
// app/components/links.tsx

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

#### 滚动到一个`id`(Scrolling to an id)

Next.js App Rounter的默认行为是滚动到新路由的顶部，或保持滚动位置以进行前后导航。

如果在导航的时候桂东到一个指定的`id`，你可以在URL后面加上一个`#` hash链接或者直接传递一个hash链接给到link的`href`属性

```javascript
<Link href="/dashboard#settings">Settings</Link>
 
// Output
<a href="/dashboard#settings">Settings</a>
```

> 小贴士
>
> - 如果导航时Next.js在视口中不可见，它将滚动到页面。


#### 禁止滚动恢复(Disabling scroll restoration)

如果你想禁止滚动行为，你可以给`<link>`传递`scroll={false}`的属性，或者传递`scroll: false`给到`router.push()`或者`router.replace()`

```javascript
// next/link
<Link href="/dashboard" scroll={false}>
  Dashboard
</Link>
```

```javascript
// useRouter
import { useRouter } from 'next/navigation'
 
const router = useRouter()
 
router.push('/dashboard', { scroll: false })
```


## `useRouter()`钩子(useRouter() hook)

`useRouter`钩子允许你使用客户端组件以编程化的方式的改变路由

```javascript
// app/page.js

'use client'
 
import { useRouter } from 'next/navigation'
 
export default function Page() {
  const router = useRouter()
 
  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
```

完整`userRouter`方法，请查看[文档](https://nextjs.org/docs/app/api-reference/functions/use-router)

## `redirect` 方法（`redirect` function）
