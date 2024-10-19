# 链接和导航（Linking和Navigating）

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

redirect专门为服务端组件设计

```javascript
// app/team/[id]/page.tsx
import { redirect } from 'next/navigation'
 
async function fetchTeam(id: string) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}
 
export default async function Profile({ params }: { params: { id: string } }) {
  const team = await fetchTeam(params.id)
  if (!team) {
    redirect('/login')
  }
 
  // ...
}
```

> 小贴士：
>
> - `redirect` 默认情况下返回307（临时重定向）状态代码。当在服务器操作中使用时，它返回303（参见其他），这通常用于在POST请求后重定向到成功页面。
> - `redirect`内部抛出错误，因此应该在try/catch块之外调用它。
> - `redirect`可以在渲染过程中在客户端组件中调用，但不能在事件处理程序中调用。您可以使用`useRouter` hook。
> - `redirect`也接受绝对URL，可用于重定向到外部链接。
> - 如果你想在渲染过程之前重定向，请使用next.config.js或Middleware。

查看[redirect](https://nextjs.org/docs/app/api-reference/functions/redirect)详细API

## 使用原生History API

Next.js允许你使用原生的`window.history.pushState`和`window.history.replaceState`方法来在不需要重新加载页面的情况下更新浏览器的历史栈

pushState和replaceState调用集成到Next.js路由器中，允许您与[usePathname](https://nextjs.org/docs/app/api-reference/functions/use-pathname)和[useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params)同步。

### `window.history.pushState`

使用它将新条目添加到浏览器的历史堆栈中。用户可以导航回之前的状态。例如，要对产品列表进行排序：

```javascript
'use client'
 
import { useSearchParams } from 'next/navigation'
 
export default function SortProducts() {
  const searchParams = useSearchParams()
 
  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }
 
  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```

### `window.history.replaceState`

使用它用来替换当前浏览器历史栈上的条目。用户将不被允许导航回前一个状态。例如，要切换应用程序的区域设置

```javascript
'use client'
 
import { usePathname } from 'next/navigation'
 
export function LocaleSwitcher() {
  const pathname = usePathname()
 
  function switchLocale(locale: string) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }
 
  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  )
}
```

## 路由和导航是怎么工作的？

App Router使用混合方法进行路由和导航。在服务端，你的应用程式代码会通过路由片段自动进行代码分割`code-split`。在客户端，Next.js会预取(`prefetches`)以及缓存(`caches`)路由片段。这意味着，当一个用户导航到一个新的路由，浏览器将不会重新加载页面，仅仅只有路由片段改变并重新渲染，这改进了导航的性能和用户体验。

### 1. 代码分割(code-splitting)

代码分割允许你将应用程序分割成更小的包用以被浏览器下载和执行。这减少了减少了每个请求的大量的数据传输和执行时间，从而帮助改进性能；

服务端组件允许你的应用程序代码通过路由片段被自动代码分割。这意味着只有需要的代码会被当前的导航和路由加载。

### 2. 预取(Prefetching)

预取是在用户访问前，在背后预先加载路由的一种方式。

在Next.js中有两种路由方式可以预取

- `<link>`组件：当Link在用户的viewport中可见时，对应的路由就会自动预取；预取在页面第一次加载之后滚动进入视图之后开始；
- `router.prefetch()`：`useRouter`钩子可以被用作预取

`<link>`的默认预取行为(即当预取属性未指定或者设置为null时)因你使用`loading.js`方法不同而异。只有共享布局，沿着渲染的组件“树”向下，直到第一个加载.js文件，才会被预取并缓存30秒。这降低了获取整个动态路由的成本，这意味着您可以显示即时加载状态以让用户获得更好的视觉反馈效果；

你可以通过将`prefetch`属性设置为`false`来禁用预取，或者，您可以通过将预取属性设置为true来预取加载边界之外的整页数据。

查看`<Link>`[相关API](https://nextjs.org/docs/app/api-reference/components/link)

> 小贴士：预取只有在生产状态才会被触发，在开发时不会

### 3. 缓存(Caching)

Next.js有一个名为Router cache的内存客户端缓存。当用户在应用中导航时，预取路由片段和一访问过的路由的RSC Payload将存储在缓存中；

这意味着在导航时，这个缓存将尽可能多的被复用，而不是向服务端发送一个新请求，这样通过减少请求数量和数据传递改善了性能；

学习更多有关[Router Cache](https://nextjs.org/docs/app/building-your-application/caching#router-cache)的工作原理和如何配置；

### 4. 局部渲染(Partial Rendering)

局部渲染意味着只有在导航时发生变化的路线段才会在客户端上重新渲染，并且任何共享的路线段都会被保留。

举例，当两个兄弟路由之间发生导航时，如`/dashboard/settings`和`/dashboard/analytics`，`setting`和`analytics`的页面将会被重新渲染，共享layout`dashboard`将会被保存.

![1729345662499](images/3_Linking_And_Navigating/1729345662499.png)

如果没有部分渲染，每个导航都会导致整个页面在客户端上重新渲染。仅渲染更改的段可以减少传输的数据量和执行时间，从而提高性能。

### 5. 软导航(Soft Naviation)

浏览器在页面导航之间执行一个“硬导航”，Next.js的App Router允许在页面之间“软导航”，确保只有已经改变的路由片段会局部渲染，这允许客户端React状态在导航期间被保存；


### 6. 前后导航(Back and Forward Navigation)
