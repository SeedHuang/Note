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
