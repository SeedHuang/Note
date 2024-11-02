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

您可以使用[增量静态再生（ISR）](../../3_Data_Fetching/incemental_static_regeneration(ISR).md)重新验证缓存数据：

```javascript
// app/posts/route.tsx

export const revalidate = 60
 
export async function GET() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
 
  return Response.json(posts)
}
```

### Cookies

您可以通过[cookies](../../02_API_Reference/03_Functions/02_cookies.md)来`next/headers`读取或设置Cookie。此服务器函数可以直接在路由处理程序中调用，也可以嵌套在另一个函数中。
或者，您可以使用[Set-Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie)标头返回新的响应。

```javascript
// app/posts/route.ts

import { cookies } from 'next/headers'
 
export async function GET(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
 
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `token=${token.value}` },
  })
}
```

您还可以使用底层Web API从请求([NextRequest](../../02_API_Reference/03_Functions/12_NextRequest.md))中读取Cookie：

```javascript
// app/api/route.ts

import { type NextRequest } from 'next/server'
 
export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')
}
```

### Headers

您可以从`next/headers`中通过[headers](../../02_API_Reference/03_Functions/10_headers.md)方法读区headers。此服务器函数可以直接在路由处理程序中调用，也可以嵌套在另一个函数中。
此`header`实例是只读的。要设置`header`，您需要返回一个包含新`header`的新`Response`。

```javascript
// app/api/route.tsx

import { headers } from 'next/headers'
 
export async function GET(request: Request) {
  const headersList = await headers()
  const referer = headersList.get('referer')
 
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer },
  })
}
```

您还可以使用底层Web API从请求([NextRequest](../../02_API_Reference/03_Functions/12_NextRequest.md))中读取标头：

```javascript
// app/api/route.ts

import { type NextRequest } from 'next/server'
 
export async function GET(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
}
```

### Redirects

```javascript
// app/api/route.ts

import { redirect } from 'next/navigation'
 
export async function GET(request: Request) {
  redirect('https://nextjs.org/')
}
```

### 动态路由片段Dynamic Route Segments

> 我们建议在继续之前阅读“[Defining Routes](./1_Defining_Routes.md)”页面。

路由处理程序可以使用[Dynamic Route(动态片段)](./9_Dynamic_Routes.md)从动态数据创建请求处理程序。

```javascript
// app/items/[slug]/route.ts

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug // 'a', 'b', or 'c'
}
```

| Route                       | Example URL | `params`                 |
| --------------------------- | ----------- | ------------------------ |
| `app/items/[slug]/route.js` | `items/a`   | `Promise<{ slug: 'a' }>` |
| `app/items/[slug]/route.js` | `items/b`   | `Promise<{ slug: 'b' }>` |
| `app/items/[slug]/route.js` | `items/c`   | `Promise<{ slug: 'c' }>` |

### URL 参数(URL Query Parameters)

传递给路由处理程序的请求对象是一个`NextRequest`实例，它有一些额外的便利方法，包括更容易处理查询参数。

```javascript
// app/api/search/route.ts

import { type NextRequest } from 'next/server'
 
export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  // query is "hello" for /api/search?query=hello
}
```

### Streaming

流媒体通常与OpenAI等大型语言模型（LLM）结合使用，用于AI生成的内容。了解更多关于[AI SDK](https://sdk.vercel.ai/docs/introduction)的信息。

```javascript
// app/api/chat/route.ts

import { openai } from '@ai-sdk/openai'
import { StreamingTextResponse, streamText } from 'ai'
 
export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  })
 
  return new StreamingTextResponse(result.toAIStream())
}
```

这些抽象使用Web API创建流。您还可以直接使用底层Web API。

```javascript
// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()
 
      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}
 
function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
 
const encoder = new TextEncoder()
 
async function* makeIterator() {
  yield encoder.encode('<p>One</p>')
  await sleep(200)
  yield encoder.encode('<p>Two</p>')
  await sleep(200)
  yield encoder.encode('<p>Three</p>')
}
 
export async function GET() {
  const iterator = makeIterator()
  const stream = iteratorToStream(iterator)
 
  return new Response(stream)
}
```

### Request Body

您可以使用标准Web API方法读取请求`Request` body：

```javascript
// app/items/route.ts

export async function POST(request: Request) {
  const res = await request.json()
  return Response.json({ res })
}
```

### Request Body FormData

您可以使用`request.FormData()`函数读取`FormData`：

```javascript
// app/items/route.ts

export async function POST(request: Request) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  return Response.json({ name, email })
}
```

由于`formData`数据都是字符串，您可能希望使用[zod-form-data](https://www.npmjs.com/package/zod-form-data)来验证请求，并以您喜欢的格式（例如`number`）检索数据。

### CORS

您可以使用标准Web API方法为特定的路由处理程序设置CORS头：

```javascript
// app/api/router.ts

export async function GET(request: Request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

> 小贴士
> 
> 要将CORS标头添加到多个路由处理程序中，可以使用[Middleware](./13_Middleware.md)或[`next.config.js`](https://nextjs.org/docs/app/api-reference/next-config-js/headers#cors)文件。
> 或者，请参阅我们的CORS示例包。

