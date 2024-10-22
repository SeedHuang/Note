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

`redirect`功能允许你重定向你的用户去另外一个URL。你可以称为服务端组件([Server Components](../2_Rending(渲染)/1_server_components.md))的`redirect`
