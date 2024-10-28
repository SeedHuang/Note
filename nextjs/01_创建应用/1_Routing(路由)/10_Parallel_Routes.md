# 并行路由(Parallel Routes)

[原文->](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)

并行路由允许您在同一布局中同时或有条件地渲染一个或多个页面。它们对于应用程序的高度动态部分非常有用，例如社交网站上的仪表板和提要。

例如，考虑到仪表板，您可以使用并行路由同时呈现`team`和`analytics`页面：

![1729776963614](images/10_Parallel_Routes/1729776963614.png)

## 插槽(Slots)

使用命名**slots**建平行路线。插槽是用`@folder`约定定义的。例如，以下文件结构定义了两个插槽：`@analytics`和`@team`：

![1729777122160](images/10_Parallel_Routes/1729777122160.png)

插槽作为属性`props`传递给共享父布局。对于上面的例子，`app/layout.js`中的组件现在接受`@analytics`和`@team` slots道具，并可以与`children`道具并行渲染它们：

```javascript
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  )
}
```

但是，插槽`slots`不是`route segments`，也不影响URL结构。例如，对于`/@analytics/views`，URL将是`/views`，因为`@analytics`是一个插槽。插槽与常规页面组件组合在一起，形成与路由片段相关的最终页面。因此，在同一路由片段级别上不能有单独的静态和动态插槽。如果一个插槽是动态的，则该级别的所有插槽都必须是动态的。

> 小贴士
>
> - `children`属性具是一个隐式插槽，不需要映射到文件夹。这意味着`app/page.js`相当于`app/@children/page.js`。

## 活动状态和导航(Active state and navigation)

默认情况下，Next.js会跟踪每个插槽的活动状态（或子页面）。但是，在插槽中呈现的内容将取决于导航类型：

[软导航(Soft Navigation)](./3_Linking_And_Navigating.md#3_Linking_And_Navigating.md#5-软导航soft-navigation)：在客户端导航期间，Next.js将执行部分渲染，更改插槽内的子页面，同时保持其他插槽的活动子页面，即使它们与当前URL不匹配。

硬导航(hard Navigation)：在整个页面加载（浏览器刷新）后，Next.js无法确定与当前URL不匹配的插槽的活动状态。相反，它将为不匹配的槽呈现一个[`default.js`](#defaultjs)文件，如果`default.js`不存在，则呈现404。

> 小贴士：
>
> - 404 对于无合适的路由是有助于确保您不会意外地在页面上呈现非预期的并行路由。

### `default.js`

> `default.js`自己的一个小小认知，default.js在parrallel route中配合导航栏中的地址使用的工具，简单的说如果导航栏地址是/a/b/c,如果你对应的`@xxxx`下面没有对应的路径，它就会使用default.js作为默认显示，
>
> ```
> /app
> ----/@team
> --------/b
> -----/b
> ---------/c
> 平行路由和正常路由有一一对应关系
>
> 而Next.js存在很多契约行的文件
>
> // 平行地址
> /@team/b
>
> // 用户访问
> localhost:3000/b
> 可以正常显示/@team/b/page.js的内容
>
> //但是用户访问
> localhost:3000/b/c页面的时候，因为@team/b下面没有对应的c路径，所以就会找不到，一旦找不到，就会触发default.js，default
> ```

您可以定义一个default.js文件，作为初始加载或全页面重新加载期间不匹配插槽的回退。

![1729837959678](images/10_Parallel_Routes/1729837959678.png)

当导航到`/settings`时，`@team`插槽将呈现`/settings`页面，同时保持`@analytics`插槽的当前活动页面。
刷新后，Next.js将为`@analytics`渲染一个`default.js`。如果default.js不存在，则呈现404。
此外，由于children是一个隐式插槽，当Next.js无法恢复父页面的活动状态时，您还需要创建一个default.js文件来为children呈现回退。

### `useSelectedLayoutSegment(s)`

[`usedLayoutSegment`](../../02_API_Reference/03_Functions/24_useSelectedLayoutSegment.md)和[`usedLayoutSegments`](../../02_API_Reference/03_Functions/25_useSelectedLayoutSegments.md)都接受`parallelRoutesKey`参数，该参数允许您读取插槽内的活动路由片段(active route segment)。

```javascript
// app/layout.tsx

'use client'
 
import { useSelectedLayoutSegment } from 'next/navigation'
 
export default function Layout({ auth }: { auth: React.ReactNode }) {
  const loginSegment = useSelectedLayoutSegment('auth')
  // ...
}
```

## 举例

### 条件路由(Conditional Routes)

您可以使用Parallel Routes(并行路由)根据特定条件（如用户角色）有条件地渲染路由。例如，要为`/admin`或`/user`角色呈现不同的仪表板页面：

![1729863282740](images/10_Parallel_Routes/1729863282740.png)

```javascript
// app/dashboard/layout.tsx

import { checkUserRole } from '@/lib/auth'
 
export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode
  admin: React.ReactNode
}) {
  const role = checkUserRole()
  return <>{role === 'admin' ? admin : user}</>
}
```

### 标签组(Tab Groups)

您可以在插槽内添加布局，以允许用户独立导航插槽。这对于创建选项卡很有用。
例如，@analytics插槽有两个子页面：`/page-views`和`/visitors`。

![1729863524220](images/10_Parallel_Routes/1729863524220.png)

在`@analytics`中，创建一个`layout`文件以在两个页面之间共享选项卡：

```javascript
// app/@analytics/layout.tsx

import Link from 'next/link'
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Link href="/page-views">Page Views</Link>
        <Link href="/visitors">Visitors</Link>
      </nav>
      <div>{children}</div>
    </>
  )
}
```

### Modals(模态)

并行路由可以与[拦截路由(Intercepting routes)](./11_Intercepting_Routes.md)一起使用，以创建支持深度链接的模型。这使您能够解决构建模型时的常见挑战，例如：

- 使模态内容可通过URL共享。
- 刷新页面时保留上下文，而不是关闭模式。
- 在向后导航时关闭模式，而不是转到前一条路线。
- 重新打开正向导航模式。

考虑以下UI模式，用户可以使用客户端导航从布局打开登录模式，或访问单独的`/login`页面：
![1729864396747](images/10_Parallel_Routes/1729864396747.png)

要实现此模式，首先创建一个呈现主登录页面的`/login`路由。

![1729864789969](images/10_Parallel_Routes/1729864789969.png)

```javascript
// app/login/page.tsx

import { Login } from '@/app/ui/login'
 
export default function Page() {
  return <Login />
}
```

然后，在`@auth`槽中，添加返回`null`的`default.js`文件。这确保了模态在不活动时不会被渲染。

```javascript
// app/@auth/default/tsx

export default function Default() {
  return '...'
}
```

在`@auth`插槽中，通过更新`/(.)login`文件夹来拦截`/login`路由。将`<Modal>`组件及其子组件导入到`/(.)login/page.tsx`文件中：

```javascript
// app/@auth/(.)login/page.tsx

import { Modal } from '@/app/ui/modal'
import { Login } from '@/app/ui/login'
 
export default function Page() {
  return (
    <Modal>
      <Login />
    </Modal>
  )
}
```

> 小贴士：
>
> - 用于拦截路由的约定，例如(.)，取决于您的文件系统结构。参见[拦截路线](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes#convention)惯例。
>   通过将<Modal>功能与模态内容`(<Login>)`分离，您可以确保模态中的任何内容（例如[表单forms](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms)）都是服务器组件。有关更多信息，请参阅[交错客户端和服务器组件](../../01_创建应用/2_Rending(渲染)/3_server_and_client_composition_patterns.md#支持的模式将服务端组件作为属性传递给客户端组件)。

#### 打开模态模式(Opening the modal)

现在，您可以利用Next.js路由器打开和关闭模态。这可确保在打开模态模式以及前后导航时正确更新URL。
要打开模式，请将@auth插槽作为prop传递给父布局，并将其与`children` prop一起渲染。

```javascript
// app/layout.tsx

import Link from 'next/link'
 
export default function Layout({
  auth,
  children,
}: {
  auth: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <nav>
        <Link href="/login">Open modal</Link>
      </nav>
      <div>{auth}</div>
      <div>{children}</div>
    </>
  )
}
```

当用户单击 `<Link>`时，“模态模式”将打开，而不是导航到`/login`页面。但是，在刷新或初始加载时，导航到`/login`将使用户进入主登录页面。

#### 关闭模态模式(Closing the Modal)

您可以通过调用`router.back()`或使用`<Link>`组件来关闭模式。

```javascript
// app/ui/modal.tsx

'use client'
 
import { useRouter } from 'next/navigation'
 
export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
 
  return (
    <>
      <button
        onClick={() => {
          router.back()
        }}
      >
        Close modal
      </button>
      <div>{children}</div>
    </>
  )
}
```

当使用`<Link>`组件导航离开不应再呈现`@auth`插槽的页面时，我们需要确保`并行路由(parrallel routes)`与返回`null`的组件匹配。例如，当导航回根页面时，我们创建了一个`@auth/page.tsx`组件：

```javascript
// app/ui/modal.tsx

import Link from 'next/link'
 
export function Modal({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Link href="/">Close modal</Link>
      <div>{children}</div>
    </>
  )
}
```

```javascript
// app/@auth/page.tsx

export default function Page() {
  return '...'
}
```

或者，如果导航到任何其他页面（如/foo、/foo/bar等），您可以使用一个包罗万象(catch-all)的插槽：

```javascript
export default function CatchAll() {
  return '...'
}
```

> 小贴士：
>
> - 由于[活动状态和导航](##活动状态和导航active-state-and-navigation)中描述的行为，我们在`@auth`插槽中使用了一条包罗万象(`catch-all`)的路由来关闭模态。由于客户端对不再匹配插槽的路由的导航将保持可见，因此我们需要将插槽与返回null的路由相匹配以关闭模态。
> - 查看具有拦截和平行路线的[模态示例](https://github.com/vercel/nextgram)。

### 加载和错误UI(Loading and Error UI)

并行路由可以独立流式传输，允许您为每条路由定义独立的错误和加载状态：

![1730102098516](images/10_Parallel_Routes/1730102098516.png)

有关更多信息，请参阅[加载UI](./4_Loading_UI_and_Streaming.md)和[错误处理](./5_Error_Hanlding_new.md)文档。
