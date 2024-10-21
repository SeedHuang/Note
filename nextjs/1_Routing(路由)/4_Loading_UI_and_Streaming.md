[原文->](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)

# 加载UI和流式加载(Loading UI and Streaming)

特殊文件`loading.js`可以帮助你在[React Suspense](https://react.dev/reference/react/Suspense)下有一个有意义的加载UI，使用这个约定，你可以在加载路由片段时显示服务器的加载状态，当渲染完成后，新内容会自动替换；

![1729479673062](images/4_Loading_UI_and_Streaming/1729479673062.png)

## 即时加载状态(instant Loading States)

即时加载状态是导航后立即显示的回退UI。您可以预渲染加载指示器，如骨架和旋转器，或未来屏幕的一小部分但有意义的部分，如封面照片、标题等。这有助于用户了解应用程序正在响应，并提供更好的用户体验。

你可以通过在文件夹中添加一个`loading.js`文件来创建一个加载状态

![1729483021978](images/4_Loading_UI_and_Streaming/1729483021978.png)

在相同的文件夹下，`loading.js`将会嵌套在`layout.js`中。他将自动包裹在`page.js`文件和`<Suspense>`boundary下的任何`children`中

![1729483180765](images/4_Loading_UI_and_Streaming/1729483180765.png)

> 小贴士：
>
> - 即使使用以服务器为中心的路由，导航(Navigation)也是即时的。
> - 导航是可中断的，这意味着更改路由不需要在导航到另一条路由之前等待路由的内容完全加载。
> - 加载新路线段时，共享布局保持交互式。

> 推荐：对路由段（布局和页面）使用loading.js约定，因为Next.js优化了此功能。

## 流式渲染和挂起(Streaming and Suspense)

除了`loading.js`，你还可以给你的UI组件手动创建`<Suspense>`Boundaries。[Node.js 和 Edge 运行时](../2_Rending(渲染)/4_edge_and_nodejs_runtimes.md)都支持App Router的流式渲染和[Suspense](https://react.dev/reference/react/Suspense)

> 小贴士：
>
> [某些浏览器](https://bugs.webkit.org/show_bug.cgi?id=252413)会缓冲流式响应。在超过1024字节之前，您可能看不到流式响应。这通常只影响“hello world”应用程序，而不影响实际应用程序。

## 什么是流式渲染(What is Streaming?)

要学习流式渲染在React和Next.js中是怎么工作的对于理解服务端渲染和他的限制是很有帮助的；

比如SSR，在用户可以看见一个可交互的页面前需要经历多少步骤：

1. 所有的数据需要从服务端获取；
2. 然后服务端来渲染页面的HTML；
3. 将HTML，CSS以及Javascript将会被发送到客户端；
4. 一个有html和css但不可交互的用户界面就会被显示；
5. 最终，React通过[水合(hydrate)](https://react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html)的方式将用户界面变得可以交互；

![1729484806057](images/4_Loading_UI_and_Streaming/1729484806057.png)

这些步骤是顺序和阻塞的，意味着服务仅可以在获得数据后将HTML渲染，然后，在客户端上，React可以将界面和所有已经下载的组件进行水合(hydrate)；

使用React和Next.js的SSR通过尽快向用户显示非交互式页面来帮助提高感知的加载性能。

![1729485081424](images/4_Loading_UI_and_Streaming/1729485081424.png)

然而，它仍然可能很慢，因为在向用户显示页面之前，需要完成服务器上的所有数据获取。

Streaming允许你将页面的HTML分拆成更小的块一点一点从服务端给到客户端；

![1729494251277](images/4_Loading_UI_and_Streaming/1729494251277.png)

这就允许了页面的中某些部分可以更快的显示，而不用等到所有所有界面渲染的数据准备好才开始渲染；

Stream可以在React的组件下运行的很好，是因为每个react组件都可以作为一个单独包。那些具有更高优先级的组件(比如产品信息)或者不依赖数据就可以发送的部分(比如说layout)，就可以更早的发生水合。那些更低优先级的组件（如，评审、相关产品）就可以在请求完他们的数据后再由服务端统一发送。

![1729494600341](images/4_Loading_UI_and_Streaming/1729494600341.png)

Streaming方式对那些想预防长时间获取数据从而阻碍页面渲染的场景非常有效，因为可以减少[Time to First Byte(TTFB即加载第一个字节所需时间)](https://web.dev/articles/ttfb?hl=zh-cn)以及[First Contentful Paint(FCP)](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint?hl=zh-cn)，他同样也可以改进[Time to interactive(TTI即可交互时间)](https://developer.chrome.com/docs/lighthouse/performance/interactive?hl=zh-cn)，特别是在一些比较慢的机型上面

## 举例

`<Suspense>`是用来包裹一个需要异步运行的组件(比如说要发送信息),当一开始需要显示fallback UI(比如骨架图)，一旦异步动作完成，它就会立即切换回你的组件。

```javascript
import { Suspense } from 'react'
import { PostFeed, Weather } from './Components'
 
export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  )
}
```

通过使用Suspense，你可以获得以下好处：

1. 流式的服务端渲染(Streaming Server Rendering)：可以渐进的从服务端向客户端渲染页面。
2. 有选择性的水合(Selective Hydration)：React根据用户交互优先考虑哪些组件首先进行交互。

查看更多的Suspense例子以及案例，请查看[文章](https://react.dev/reference/react/Suspense)

## SEO

Next.js将等待`generateMetadata`内部的数据获取完成，然后再将UI流式传输到客户端。这保证了流式响应的第一部分包含`<head>`标签。

由于流媒体是服务器渲染的，因此不会影响SEO。您可以使用谷歌的[富结果测试工具(Rich Result Test)](https://search.google.com/test/rich-results)来查看您的页面在谷歌网络爬虫中的显示方式，并查看序列化的HTML（[源代码](https://web.dev/articles/rendering-on-the-web?hl=zh-cn#seo-considerations)）。

## 状态代码(Status Codes)

流式传输时，将返回`200`状态码，表示请求成功。

服务器仍然可以在流式内容本身内向客户端传达错误或问题，例如，在使用`redirect`或`notFound`时。由于响应标头已发送到客户端，因此无法更新响应的状态代码。这不会影响`SEO`。
