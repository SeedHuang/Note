# default.js

default.js`文件用于在Next.js在加载完整页面后无法恢复插槽的活动状态时，在Parallel Routes中呈现回退。 在软导航期间，Next.js会跟踪每个插槽的活动状态（子页面）。但是，对于硬导航（全页面加载），Next.js无法恢复活动状态。在这种情况下，可以为与当前URL不匹配的子页面呈现default.js文件。 考虑以下文件夹结构。`@team`插槽有一个`settings`页面，但`@analytics`没有。

![1729922894731](images/01_defaultjs/1729922894731.png)

当导航到`/settings`时，`@team`插槽将呈现`settings`页面，同时保持`@analytics`插槽的当前活动页面。
刷新后，Next.js将为`@analytics`渲染一个`default.js`。如果`default.js`不存在，则呈现`404`。
此外，由于`children`是一个隐式插槽，当Next.js无法恢复父页面的活动状态时，您还需要创建一个`default.js`文件来为`children`呈现回退。

---

## 引用(Reference)

### `params` (可选)

一个promise，解析为一个对象，该对象包含从根段到插槽子页面的[动态路由参数(dynamic route parameters)](../../01_创建应用/1_Routing(路由)/9_Dynamic_Routes.md)。例如：

```javascript
// app/[artist]/@sidebar/default.js

export default async function Default({
  params,
}: {
  params: Promise<{ artist: string }>
}) {
  const artist = (await params).artist
}
```



| 列子                                     | URL        | `params`                                      |
| ---------------------------------------- | ---------- | --------------------------------------------- |
| app/[artist]/@sidebar/default.js         | /zack      | `Promise(<{ artist: 'zack' }>)`               |
| app/[artist]/[album]/@sidebar/default.js | /zack/next | `Promise(<{ artist: 'zack', album: 'next'}>)` |

因为`params` prop是一个promise。您必须使用`async/await`或React的[use](https://react.dev/reference/react/use)函数来访问这些值。
在版本14和更早的版本中，params是一个同步道具。为了提高向后兼容性，你仍然可以在Next.js 15中同步访问它，但这种行为将来会被弃用。
