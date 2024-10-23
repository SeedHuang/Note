# 重定向(Redirecting)

在Next.js中有许多处理重定向(redirects)的方式。本页将介绍每个可用选项、用例以及如何管理大量重定向。


| API                         | 目的(Purpose)                        | 地点(Where)                        | 状态码(Status Code)            |
| --------------------------- | ------------------------------------ | ---------------------------------- | ------------------------------ |
| redirect                    | 在一个操作或者事件发生之后重定向用户 | 务器组件、服务器操作、路由处理程序 | 307（临时）或303（服务器操作） |
| permanentRedirect           | 在一个操作或者事件发生之后重定向用户 | 务器组件、服务器操作、路由处理程序 | 308（永久）                    |
| useRouter                   | 执行客户端导航                       | 客户端组件中的事件处理程序         | N/A                            |
| redirects in next.config.js | 基于路径重定向传入请求               | `next.config.js `文件              | 307（临时）或308（永久）       |
| NextResponse.redirect       | 根据条件重定向传入请求               | 中间件                             | 任何                           |

## `redirect`功能

`redirect`功能允许你重定向你的用户去另外一个URL。你可以称为[服务端组件(Server Components)](../2_Rending(渲染)/1_server_components.md)，[路由处理器(Route Handlers)](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)和[服务端动作(Server Actions)](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)的`redirect`

`redirect`经常在操作和事件发生后使用，比如，创建一个post请求：

```javascript
// app/actions.tsx

'use server'
 
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
 
export async function createPost(id: string) {
  try {
    // Call database
  } catch (error) {
    // Handle errors
  }
 
  revalidatePath('/posts') // Update cached posts
  redirect(`/post/${id}`) // Navigate to the new post page
}
```

> 小贴士：
>
> - `redirect` 默认情况下返回307（临时重定向）状态代码。当在服务器操作中使用时，它返回303（参见其他），这通常用于在POST请求后重定向到成功页面。
> - `redirect` 内部抛出错误，因此应该在try/catch块之外调用它。
> - `redirect`可以在渲染过程中在客户端组件中调用，但不能在事件处理程序中调用。您可以使用[useRouter](https://nextjs.org/docs/app/building-your-application/routing/redirecting#userouter-hook)挂钩替代。
> - `redirect`也接受绝对URL，可用于重定向到外部链接。
> - 如果你想在渲染过程之前重定向，请使用next.config.js或Middleware。

关更多信息，请参阅重定向[API参考](https://nextjs.org/docs/app/api-reference/functions/redirect)。

## `permanentRedirect` function

`permanentRedirect`功能允许你永久重定向你用户去另外一个URL。你可以在[服务端组件(Server Components)](../2_Rending(渲染)/1_server_components.md)，[路由处理器(Route Handlers)](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)和[服务端动作(Server Actions)](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)使用`parmanentRedirect`

`permanetRedirect`通常用于更改实体规范URL的突变或事件之后，例如在用户更改用户名后更新其个人资料URL：

```javascript
// app/actions.ts

'use server'
 
import { permanentRedirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'
 
export async function updateUsername(username: string, formData: FormData) {
  try {
    // Call database
  } catch (error) {
    // Handle errors
  }
 
  revalidateTag('username') // Update all references to the username
  permanentRedirect(`/profile/${username}`) // Navigate to the new user profile
}
```

> 小贴士
>
> - `permanentRedirect`默认返回308（永久重定向）状态码。
> - `permanentRedirect`也接受绝对URL，可用于重定向到外部链接。
> - 如果你想在渲染过程之前`redirect`，请使用next.config.js或Middleware。

有关更多信息，请参阅[permanntRedirect ](https://nextjs.org/docs/app/api-reference/functions/permanentRedirect)API参考。

## `useRouter()` hook

如果需要在客户端组件中的事件处理程序内`redirect`，可以使用`useRouter`钩子中的`push`方法。例如：

```javascript
// app/page.tsx

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

> 小贴士：
>
> - 如果你不需要以编程方式导航用户，你应该使用`<link>`组件。

有关更多信息，请参阅[useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router) API参考。

## `next.config.js`中的redirects

`next.config.js`文件中的`redirect`选项允许您将传入请求路径重定向到其他目标路径。当您更改页面的URL结构或拥有提前知道的重定向列表时，这很有用。
重定向支持[path(路径)](https://nextjs.org/docs/app/api-reference/next-config-js/redirects#path-matching)、[header(标头)、cookie和query matching(查询匹配)](https://nextjs.org/docs/app/api-reference/next-config-js/redirects#header-cookie-and-query-matching)，使您能够根据传入请求灵活地重定向用户。

要使用重定向，请将选项添加到`next.config.js`文件中：

```javascript
// next.config.js

module.exports = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
      // Wildcard path matching
      {
        source: '/blog/:slug',
        destination: '/news/:slug',
        permanent: true,
      },
    ]
  },
}
```

有关更多信息，请参阅[重定向API](https://nextjs.org/docs/app/api-reference/next-config-js/redirects)参考。

> 小贴士：
>
> - `redirect`可以通过设置`permant`选项返回带有的307（临时重定向）或308（永久重定向）状态码。
> - `redirect`在平台上可能有限制。例如，在Vercel上，重定向限制为1024次。要管理大量重定向（1000+），请考虑使用[MiddleWare(中间件)](https://nextjs.org/docs/app/building-your-application/routing/middleware)创建自定义解决方案。有关更多信息，请参阅大规模管理重定向。
> - `redirect`在Middleware之前执行

## 中间件中的`NextResponse.redirect`

Middleware(中间件)允许您在请求完成之前运行代码。然后，根据传入的请求，使用`NextResponse.redirect`重定向到其他URL。如果您想根据条件（例如身份验证、会话管理等）重定向用户或进行大量重定向，这很有用。

```javascript
// middleware.ts

import { NextResponse, NextRequest } from 'next/server'
import { authenticate } from 'auth-provider'
 
export function middleware(request: NextRequest) {
  const isAuthenticated = authenticate(request)
 
  // If the user is authenticated, continue as normal
  if (isAuthenticated) {
    return NextResponse.next()
  }
 
  // Redirect to login page if not authenticated
  return NextResponse.redirect(new URL('/login', request.url))
}
 
export const config = {
  matcher: '/dashboard/:path*',
}
```

> 小贴士：
>
> - `Middleware`中间件在`next.config.js`中`redirect`后和渲染前运行。

有关更多信息，请参阅[中间件](https://nextjs.org/docs/app/building-your-application/routing/middleware)文档。

## 大规模管理重定向(高级)

要管理大量重定向（1000+），您可以考虑使用中间件创建自定义解决方案。这允许您以编程方式处理重定向，而无需重新部署应用程序。

为此，您需要考虑：

- 创建和存储重定向映射。
- 优化数据查找性能。

> Next.js示例：请参阅我们的带有[布隆过滤器（bloom filter）](../../basic/bloom_filter.md)的中间件示例，了解以下建议的实现。

### 1.创建和存储重定向映射(Creating and storing a redirect map)

重定向映射是可以存储在数据库（通常是键值存储）或JSON文件中的重定向列表。
考虑以下数据结构：

```javascript
{
  "/old": {
    "destination": "/new",
    "permanent": true
  },
  "/blog/post-old": {
    "destination": "/blog/post-new",
    "permanent": true
  }
}
```

在[Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)中，您可以从Vercel的[Edge Config](https://vercel.com/docs/storage/edge-config/get-started?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)或[Redis](https://vercel.com/docs/storage/vercel-kv?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)等数据库中读取数据，并根据传入的请求重定向用户：

```javascript
// middleware.ts

import { NextResponse, NextRequest } from 'next/server'
import { get } from '@vercel/edge-config'
 
type RedirectEntry = {
  destination: string
  permanent: boolean
}
 
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const redirectData = await get(pathname)
 
  if (redirectData && typeof redirectData === 'string') {
    const redirectEntry: RedirectEntry = JSON.parse(redirectData)
    const statusCode = redirectEntry.permanent ? 308 : 307
    return NextResponse.redirect(redirectEntry.destination, statusCode)
  }
 
  // No redirect found, continue without redirecting
  return NextResponse.next()
}
```

### 2.优化数据查找性能(Optimizing data lookup performance)

为每个传入请求读取大型数据集可能既缓慢又昂贵。有两种方法可以优化数据查找性能：
使用为快速读取而优化的数据库，如Vercel Edge Config或Redis。
在读取较大的重定向文件或数据库之前，使用布隆过滤器等数据查找策略有效地检查是否存在重定向。
考虑到前面的示例，您可以将生成的布隆过滤器文件导入中间件，然后检查布隆过滤器中是否存在传入请求路径名。
如果是这样，请将请求转发给路由处理程序，路由处理程序将检查实际文件并将用户重定向到适当的URL。这避免了将大型重定向文件导入中间件，这可能会减慢每个传入请求的速度。

```javascript
// middleware.ts

import { NextResponse, NextRequest } from 'next/server'
import { ScalableBloomFilter } from 'bloom-filters'
import GeneratedBloomFilter from './redirects/bloom-filter.json'
 
type RedirectEntry = {
  destination: string
  permanent: boolean
}
 
// Initialize bloom filter from a generated JSON file
const bloomFilter = ScalableBloomFilter.fromJSON(GeneratedBloomFilter as any)
 
export async function middleware(request: NextRequest) {
  // Get the path for the incoming request
  const pathname = request.nextUrl.pathname
 
  // Check if the path is in the bloom filter
  if (bloomFilter.has(pathname)) {
    // Forward the pathname to the Route Handler
    const api = new URL(
      `/api/redirects?pathname=${encodeURIComponent(request.nextUrl.pathname)}`,
      request.nextUrl.origin
    )
 
    try {
      // Fetch redirect data from the Route Handler
      const redirectData = await fetch(api)
 
      if (redirectData.ok) {
        const redirectEntry: RedirectEntry | undefined =
          await redirectData.json()
 
        if (redirectEntry) {
          // Determine the status code
          const statusCode = redirectEntry.permanent ? 308 : 307
 
          // Redirect to the destination
          return NextResponse.redirect(redirectEntry.destination, statusCode)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
 
  // No redirect found, continue the request without redirecting
  return NextResponse.next()
}

```

然后，在路由处理程序中：

```javascript
// app/redirect/route.ts

import { NextRequest, NextResponse } from 'next/server'
import redirects from '@/app/redirects/redirects.json'
 
type RedirectEntry = {
  destination: string
  permanent: boolean
}
 
export function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname) {
    return new Response('Bad Request', { status: 400 })
  }
 
  // Get the redirect entry from the redirects.json file
  const redirect = (redirects as Record<string, RedirectEntry>)[pathname]
 
  // Account for bloom filter false positives
  if (!redirect) {
    return new Response('No redirect', { status: 400 })
  }
 
  // Return the redirect entry
  return NextResponse.json(redirect)
}
```

> 小贴士
>
> - 要生成布隆过滤器，您可以使用类似[布隆过滤器的库](https://www.npmjs.com/package/bloom-filters)。
> - 您应该验证向路由处理程序发出的请求，以防止恶意请求。
