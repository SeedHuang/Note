# Edge和Node.js运行时

在Next.js的上下文中，运行时是指代码在执行过程中可用的一组库、API和一般功能。

在服务端上，你的应用代码可以被渲染在两种运行时上：

- Node.js运行时（默认）有从生态系统访问所有Node.js API和兼容包；
- The Edge运行时是基于[网页API](https://nextjs.org/docs/app/api-reference/edge)

## 运行时的不同

在选择一个运行时的时候会有许多考虑的事情。下面的表格展示了主要的不同点；


|                                                                                                                                                     | Node   | Serverless | Edge             |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------- | ---------------- |
| Cold Boot                                                                                                                                           | /      | Normal     | Low              |
| [HTTPS Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)                                           | Yes    | Yes        | Yes              |
| IO                                                                                                                                                  | All    | All        | `fetch`          |
| Scalability                                                                                                                                         | /      | High       | Highest          |
| Security                                                                                                                                            | Normal | High       | High             |
| Latency（延迟）                                                                                                                                     | Normal | Low        | Lowest           |
| npm Packages                                                                                                                                        | All    | All        | A smaller subset |
| [Static Rendering](https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default)                      | Yes    | Yes        | No               |
| [Dynamic Rendering](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering)                            | Yes    | Yes        | Yes              |
| [Data Revaliation w/fetch](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data) | Yes    | Yes        | Yes              |

## Edge Runtime

在Next.js中，轻量级的Edge Runtime是可访问的Nodejs APIs的一个子集。

如果您需要以低延迟、小而简单的功能提供动态、个性化的内容，Edge Runtime是理想的选择。Edge Runtime的速度来自于它对于资源的最小化使用，但在许多情况下这可能会受到限制。

举个例子，在Edge Runtime在[Vercel系统上运行的代码只能在1MB到4MB之间](https://vercel.com/docs/functions/runtimes#bundle-size-limits)，此限制包括导入的包、字体和文件，并将根据您的部署基础架构而有所不同。此外，Edge Runtime 并不支持所有的Nodejs功能，这意味着一些npm包将不能运行。比如“Module not found： Can't resolve 'fs'” 或者其他类似错误。 建议如果你要使用到这些功能的话，还是使用Node.js runtime；

> Vercel provides the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.

## Node.js Runtime

使用Node.js运行时可以访问所有Node.js API以及依赖它们的所有npm包。但是，它的启动速度不如使用Edge运行时的路由快。

将Next.js应用程序部署到Node.js服务器需要管理(mananging)、扩展(scaling)和配置(configuring)基础架构，或者，你可以考虑将你的Next.js应用部署在一个像Vercel的serverless平台，他将为你管理(mananging)、扩展(scaling)和配置(configuring)基础架构

## Serverless Node.js

如果您需要一个可扩展的解决方案，可以处理比Edge Runtime更复杂的计算负载，那么Serverless功能是理想的。例如，使用Vercel上的Serverless Functions，您的总体代码大小为50MB，包括导入的包、字体和文件。

与使用Edge Runtime的路由相比，缺点是无服务器函数在开始处理请求之前可能需要数百毫秒才能启动。根据您的网站收到的流量，这可能会经常发生，因为功能并不经常“warm”。

## 列子

### 运行时选项

您可以在Next.js应用程序中为单个路由(indivdual route)段指定运行时。为此，请声明一个名为runtime的变量并将其导出。该变量必须是字符串，并且必须具有`nodejs`或`edge`runtime的值。
以下示例演示了导出值为“edge”的运行时的页面路由段：

```javascript
// app/page.tsx
export const runtime = 'edge' // 'nodejs' (default) | 'edge'
```

你也可以将`runtime`定义在layout层级，这将会把该layout下所有的路由都运行在edge runtime下；

```javascript
// app/layout.tsx
export const runtime = 'edge' // 'nodejs' (default) | 'edge'
```

如果选项没有设置，就会使用`nodejs`作为默认runtime，如果你不想使用nodejs之外的runtime，你就可以不使用`runtime`选项；

> 请参阅[Node.js文档](https://nodejs.org/docs/latest/api/)和[Edge文档](https://nextjs.org/docs/app/api-reference/edge)，了解可用API的完整列表。根据您的部署基础架构，这两个运行时都可以支持[流式(Streaming)](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)传输。
