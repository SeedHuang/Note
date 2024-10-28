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

