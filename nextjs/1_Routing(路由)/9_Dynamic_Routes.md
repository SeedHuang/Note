[原文->](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)

# 动态路由(Dynamic Routes)

当您提前不知道确切的片段名称并希望从动态数据创建路由时，可以使用在请求时填写或在构建时预先渲染的动态片段。

## 约定(Convention)

动态段可以通过将文件夹的名称括在方括号中来创建：[folderName]。例如，[id]或[slug]。

动态分段作为参数道具传递给[布局`layout`](https://nextjs.org/docs/app/api-reference/file-conventions/layout)、[页面`page`](https://nextjs.org/docs/app/api-reference/file-conventions/page)、[路由`route`](https://nextjs.org/docs/app/api-reference/file-conventions/route)和[`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function)函数。

| 路由                      | 示例地址  | 参数            |
| ------------------------- | --------- | --------------- |
| `app/blog/[slug]/page.js` | `/blog/a` | `{ slug: 'a' }` |
| `app/blog/[slug]/page.js` | `/blog/b` | `{ slug: 'b' }` |
| `app/blog/[slug]/page.js` | `/blog/c` | `{ slug: 'c' }` |

请参阅[generateStaticParams()](#生成静态参数generating-static-params)页面，了解如何为片段生成参数。

> 小贴士：动态分段相当于`pages`目录中的动态路由。

## 生成静态参数(Generating Static Params)

`generateStaticParams`函数可以与Dynamic Route Segement结合使用，在构建时[静态生成(statically generate)](../2_Rending(渲染)/1_server_components.md#静态渲染static-rendering默认渲染方式default)路由，而不是在请求时按需生成。

```javascript
// app/blog/[slug]/page.tsx

export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
 
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

`generateStaticParams`函数的主要好处是它对数据的智能检索。如果使用获取请求在`generateStaticParams`函数中获取内容，则会[自动记忆(automatically memoized)](https://nextjs.org/docs/app/building-your-application/caching#request-memoization)这些请求。这意味着在多个`generateStaticParams`、`Layouts`和`Pages`中具有相同参数的获取`fetch`请求只会发出一次，从而减少了构建时间。

如果要从`pages`目录迁移，请使用[迁移指南](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#dynamic-paths-getstaticpaths)。

有关更多信息和高级用例，请参阅[generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)服务器函数文档。

## 捕捉所有片段(Catch-all Segments)

通过在括号`[…folderName]`内添加省略号，可以扩展动态片段以捕获所有后续片段。

例如，`app/shop/[…slug]/page.js`将匹配`/shop/hettes`，但也会匹配`/shop/gettes/tops`、`/shop/garts/tops/t`恤等。

| 路由                         | 示例地址     | 参数                        |
| ---------------------------- | ------------ | --------------------------- |
| `app/shop/[...slug]/page.js` | `/shop/`     | `{ shop: ['a'] }`           |
| `app/shop/[...slug]/page.js` | `/shop/a/b`  | `{ shop: ['a', 'b'] }`      |
| `app/shop/[...slug]/page.js` | `/shop/a/b/c | `{ shop: ['a', 'b', 'c'] }` |

---

## 可选的捕捉所有片段(Optional Catch-all Segments)

通过在双方括号中包含参数`[[…folderName]]`，可以使Catch-all Segments成为可选的。

例如，`app/shop/[[…slug]]/page.js`除了`/shop/hettes`、`/shop/hotels/tops`、`/shop/chotels/tops/`t恤之外，还将匹配`/shop`。
**catch-all**和**optional catch-all**段之间的区别在于，使用optional时，也会匹配不带参数的路由（上例中的/shop）。

| 路由                         | 示例地址     | 参数                        |
| ---------------------------- | ------------ | --------------------------- |
| `app/shop/[[...slug]]/page.js` | `/shop/`     | `{ shop: undefined }`           |
| `app/shop/[[...slug]]/page.js` | `/shop/a`     | `{ shop: ['a'] }`           |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b`  | `{ shop: ['a', 'b'] }`      |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b/c | `{ shop: ['a', 'b', 'c'] }` |

## TypeScript

使用TypeScript时，您可以根据配置的路由段为`params`添加类型。

| 路由                         | `params`Type Definition    |
| ---------------------------- | ------------ | 
| `app/blog/[slug]/page.js` | { slug: string }     |
| `app/blog/[...slug]/page.js` | { slug: string[] }     |
| `app/blog/[[...slug]]/page.js` | { slug?: string[] }     |
| `app/blog/[categoryId]/[itemId]/page.js` | { categoryId:string, itemId: string }     |



