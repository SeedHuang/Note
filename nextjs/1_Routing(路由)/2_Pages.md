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
