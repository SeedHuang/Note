# 页面和布局

以下特殊文件：`layout.js`,`page.js`以及`template.js`允许你给一个路由创建UI，本篇将会指导你如何以及何时使用这些特殊文件。

## Pages(页面)

Page是路由独有的UI，你可以通过从`page.js`文件导出一个组件来定义一个页面；

举个例子，想要创建一个`index`页面，在`app`目录下添加一个`page.js`页面；

![1729308964058](images/2_Pages/1729308964058.png)

```javascript
// app/page.tsx
export default funciton Page() {
  return <h1>Hello, Home Page!</h1>
}
```

然后，就可以创造更多的页面，创建一个新文件夹并在其中添加`page.js`文件。比如像下面的例子

```javascript
// app/dashboard/page.tsx
// `app/dashboard/page.tsx` is the UI for the `/dashboard` URL
export default function Page() {
  return <h1>Hello, Dashboard Page!</h1>
}
```

> 小贴士
>
> - 以`.js`，`.jsx`，`.tsx`文件后缀结尾的被用作Pages
> - 所有的页面都是子树的叶子结点
> - 一个可以公开访问的路由片段一定含有一个`page.js`文件
> - 默认情况下，页面是服务端组件，但是她可以被设置成客户端组件；
> - 页面可以获取数据，你可以通过[Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)来查看更多相关信息

## 布局（layouts）

Layout(布局)是一个在多个路由之间共享的UI，在导航时，布局会保持状态，保持交互性，并且不会重新渲染。布局也可以嵌套。

你可以通过在一个`layout.js`文件中导出一个React组件来定义一个layout。该组件应接受一个`children`属性，该属性将在渲染过程中填充子layout（如果存在）或页面。

比如：以下的layout将会在`/dashboard`和`/dashboard/settings`页面间被共享

![1729310821266](images/2_Pages_and_Layout/1729310821266.png)

```javascript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav></nav>
 
      {children}
    </section>
  )
}
```

## 根布局(Root Layout)(Required)

根布局被定义在`app`目录的顶层并且被应用在所有路由。这个路由是必须的，并且包含`html`和`body`标签，允许你更改初始HTML，并从服务端上返回

```javascript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        <main>{children}</main>
      </body>
    </html>
  )
}
```

## 嵌套布局(Nesting Layouts)

默认情况下，文件夹中的布局就是嵌套的，这意味着layout通过他们的`children`属性来包裹他们的子layout。你可以通过在一个专门的路由片段中添加一个`layout.js`来内嵌布局；

比如：如果要为`/dashboard`路由创建一个`layout`,就需要在`dashboard`文件夹下面添加一个`layout.js`:

![1729319278419](images/2_Pages_and_Layout/1729319278419.png)

```javascript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

如果你将以上两个layout进行组合，Root layout（`app/layout.js`）将包裹着dashboard layout(app/dasbboard/layout.js)，相同的，dashboard layout页将包含`app/dasboard/*`下所有的片段或者说页面；

![1729319582548](images/2_Pages_and_Layout/1729319582548.png)

> 小贴士：
>
> - `.js`，`.jsx`，`.tsx`文件后缀的可以被用作Layout
> - 只有Root layout（根layout）才能包含`<html/>`
