[原文->](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)

# 加载UI和流式加载(Loading UI and Streaming)

特殊文件`loading.js`可以帮助你在[React Suspense](https://react.dev/reference/react/Suspense)下有一个有意义的加载UI，使用这个约定，你可以在加载路由片段时显示服务器的加载状态，当渲染完成后，新内容会自动替换；

![1729479673062](images/4_Loading_UI_and_Streaming/1729479673062.png)

## 即时加载状态(instant Loading States)
