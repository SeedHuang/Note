# Pages(页面)

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
