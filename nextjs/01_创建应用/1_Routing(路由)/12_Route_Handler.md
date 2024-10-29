# 路由处理器

路由处理程序允许您使用[Web请求](https://developer.mozilla.org/zh-CN/docs/Web/API/Request)和[响应API](https://developer.mozilla.org/zh-CN/docs/Web/API/Response)为给定的路由创建自定义请求处理程序。

![1730124229038](images/12_Route_Handler/1730124229038.png)

> 小贴士：路由处理程序仅在应用程序目录中可用。它们相当于pages目录中的API路由，这意味着您不需要同时使用API路由和路由处理程序。

## 约定

`Route Handlers`在`app`目录中的`Route.js |ts`文件中定义：

```javascript
// app/api/route.ts
export async function GET(request: Request) {}
```

`Route Handlers`可以嵌套在`app`目录中的任何位置，类似于`page.js`和`layout.js`。但是，不能有与`page.js`位于同一路线段级别的`route.js`文件。

### 支持的HTTP方法(Supported Http Methods)

支持以下[HTTP方法](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods)：`GET`、`POST`、`PUT`、`PATCH`、`DELETE`、`HEAD`和`OPTIONS`。如果调用了不支持的方法，Next.js将返回`405 method Not Allowed`响应。

### 扩展的`NextRequest`和`NextResponse` APIs

除了支持[本地请求](https://developer.mozilla.org/zh-CN/docs/Web/API/Request)和[响应API](https://developer.mozilla.org/zh-CN/docs/Web/API/Response)外，Next.js还通过[`NextRequest`](https://nextjs.org/docs/app/api-reference/functions/next-request)和[`NextResponse`](https://nextjs.org/docs/app/api-reference/functions/next-response)对其进行了扩展，为高级用例提供了方便的助手。

---

## 行为(Behavior)

### 缓存(Caching)

默认情况下，路由处理程序不会被缓存。但是，您可以选择对`GET`方法进行缓存。其他支持的HTTP方法不会被缓存。要缓存GET方法，请在路由处理程序文件中使用路由配置选项，例如`export const dynamic='force static'`。

```javascript
// app/items/route.ts

export const dynamic = 'force-static'
 
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()
 
  return Response.json({ data })
}
```

> 小贴士：
>
> 其他受支持的HTTP方法不会被缓存，即使它们与缓存的GET方法放在同一个文件中。

### 特殊路由处理器(Special Route Handlers)

特殊的路由处理程序，如`sitemap.ts`、`opengraph-image.tsx`和`icon.tsx`，以及其他元数据文件，默认情况下保持静态，除非它们使用动态API或动态配置选项。

### 路线解析(Route Resolution)

您可以将`路由(route)`视为最低级别的路由图元。

- 它们不参与页面等布局或客户端导航。
- 不能有与`page.js`位于同一路由的`route.js`文件。


| Page                 | Route              | Result  |
| -------------------- | ------------------ | ------- |
| `app/page.js`        | `app/route.js`     | x 冲突  |
| `app/page.js`        | `app/api/route.js` | ✓ 正常 |
| `app/[user]/page.js` | `app/api/route.js` | ✓ 正常 |

每个`route.js`或`page.js`文件都会接管该路由的所有HTTP谓词。

```javascript
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
 
// ❌ Conflict
// `app/route.js`
export async function POST(request) {}
```

---

## 例子

以下示例显示了如何将路由处理程序与其他Next.js API和功能组合在一起。

### 重新验证缓存数据(Revalidating Cached Data)

您可以使用增量静态再生（ISR）重新验证缓存数据：
