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
