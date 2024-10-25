[原文->](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

# 客户端组件（Client Components）

客户端组件允许您编写在服务器上预先渲染的交互式UI，并可以使用客户端JavaScript在浏览器中运行。

## 客户端渲染的好处

包括以下两点

- 交互性：客户端组件能够使用state，effects以及事件监听器（event listener），这意味着他们可以提供用户及时反馈以及及时的更新界面；
- 使用浏览器功能（Browser APIs）：客户端组件可以访问浏览器功能（Browser APIs），例如localStorage和geolocation

## 在Next.js中使用客户端组件

如果你想使用客户端组件，你必须在你的文件最上方，在import之上，添加"use client"指令

"use client"指令用于区别服务端组件和客户端组件。这意味着如果在一个文件中添加"use client"指令，那意味着所有其他被引入的模块，包括自组件，都会被认为是客户端捆绑包的一部分；

```javascript
'use client'
 
import { useState } from 'react'
 
export default function Counter() {
  const [count, setCount] = useState(0)
 
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

以下大纲展示了在一个nested component（toggle.js）中使用`onClick`和`useState`而没有生命`use client`指令会报错的场景。这是因为在默认情况下，所有App Router下的组件都是服务端组件，所以这些api多是不能使用的，通过添加`use client`，你可以告诉React，这些你将在clieng端使用这些API；![1728998108256](images/client_components/1728998108256.png)

> 定义`use client`入口点：
> 您可以在React组件树中定义多个“使用客户端”入口点。这允许您将应用程序拆分为多个客户端包。
> 但是，不需要在需要在客户端上呈现的每个组件中定义“使用客户端”。定义边界后，导入其中的所有子组件和模块都被视为客户端包的一部分。

## 客户端组件是如何运行的？

在Next.js中，客户端组件的呈现方式不同，具体取决于请求是完整页面加载（对应用程序的首次访问或浏览器刷新触发的页面重新加载）还是后续导航的一部分。

### 完整页面加载（Full page load）

要优化出事页面加载，Next.js将使用React的API在服务器上给服务端和客户端组件渲染一个静态的Html预览；这意味着当用户第一次访问你的应用程序，他们将立即看到页面的内容，而不用等待客户端下载，编译，和执行客户端组件的javascript bundle；

#### 在服务端上

1. React将服务器端组件渲染为一个特殊的数据格式——React Server Component Payload（RSC Payload），其中包含了对于客户端组件的引用；
2. Next.js通过使用RSC Payload和客户端端组件的javascript指令在服务端上渲染对应路由下的HTML；

#### 在客户端上

1. 这些HTML被用作这个路由下显示一个快速无交互的初始化预览；
2. React Server Component Payload被用作协调客户端与服务端组件树，并更新DOM
3. JavaScript指令用于水合（hydrate）客户端组件并使其UI具有交互性。

> 什么是水合(What is hydration？)
>
> 水合是将事件监听器附加到DOM的过程，使静态HTML具有交互性。在幕后，水合作用是通过[hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot) React API完成的。

### 后续导航（Subsequent Navigations）

在后续导航中，客户端组件完全在客户端上呈现，没有服务器呈现的HTML。
这意味着客户端组件JavaScript包已被下载并解析。一旦包准备就绪，React将使用RSC Payload来协调客户端和服务器组件树，并更新DOM。

## 回到服务端环境

有时，在声明了"use client"边界后，您可能想回到服务器环境。例如，您可能希望减小客户端捆绑包的大小，在服务器上获取数据，或者使用仅在服务器上可用的API。
即使理论上代码嵌套在客户端组件中，通过交织客户端和服务器组件以及服务器操作([Server Action](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations))，您也可以将代码保留在服务器上。有关更多信息，请参阅组合模式([Composition Patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns))页面。
