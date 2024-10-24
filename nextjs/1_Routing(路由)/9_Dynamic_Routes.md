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

`generateStaticParams`函数可以与Dynamic Route Segement结合使用，在构建时静态生成(statically generate)路由，而不是在请求时按需生成。
