# 服务端和客户端混合模式(Server and Client Composition)

在建造一个React应用时，你需要想一下你应用中的哪些部分应该在服务端渲染，哪些应该在客户端渲染。本篇将包含一些值得推荐的服务器组件和客户端组件的符合模式；

## 什么时候使用服务端和客户端组件


| 你要做什么                                                                                     | 服务端组件 | 客户端组件 |
| ---------------------------------------------------------------------------------------------- | ---------- | ---------- |
| 获取数据                                                                                       | ✓         | X          |
| 访问后端资源（直接）                                                                           | ✓         | X          |
| 在服务器上保存敏感信息（access tokens，API keys，etc）                                         | ✓         | X          |
| 保持对服务器的高度依赖/减少客户端JavaScript                                                    | ✓         | X          |
| 添加交互和事件监听器例如`onClick()`, `onChange()` 这些                                         | X          | ✓         |
| 使用state，生命周期(Lefecycle), 副作用(Effects):`useState()`, `useReducer`, `useEffect()` 这些 | X          | ✓         |
| 使用只有在浏览器上可以使用API                                                                  | X          | ✓         |
| 使用依赖state，effects，或者浏览器API的自定义钩子                                              | X          | ✓         |
| 使用React Class componet                                                                       | X          | ✓         |

## 服务端组件模式

在选择进入客户端渲染之前，你可能会希望在服务器上做一些工作，比如获取数据，或者访问你的数据库或者后端服务；这里给到了一些日常可用的服务端组件的通用模式：

### 在组件之间共享数据

在服务端获取数据时，有很多情况需要在不同的组件之间共享数据，比如说，你的`layout`和`page`依赖相同数据；

为了替代使用[React Context](https://react.dev/learn/passing-data-deeply-with-context)(这个不能在服务端上使用)或者通过`props`传递数据，你可以使用`fetch`或者React的`cache`功能在组件中获取你所需要的数据；你不用担心为了获取相同的数据而发送两次相同的请求；这是因为React扩展了`fetch`函数用以自动化缓存数据请求，并且在`fetch`不可用的时候，`cache`功能能够被使用

更多可查看[memoization->](https://nextjs.org/docs/app/building-your-application/caching#request-memoization)


### 将仅服务器代码排除在客户端环境之外

由于JavaScript模块可以在服务器和客户端组件模块之间共享，因此原本只打算在服务器上运行的代码有可能潜入客户端。

举个例子，我们看下下面这个获取数据的功能

```javascript
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })
 
  return res.json()
}
```

乍眼一看，`getData`方法可以同时在服务端和客户端上运行，然而，这个方法中包含了一个`API_KEY`, 所以该功能只能在服务器上执行；

由于环境变量`API_KEY`没有以`NEXT_PUBLIC`为前缀，因此它是一个只能在服务器上访问的私有变量。为了防止环境变量泄露到客户端，Next.js将私有环境变量替换为空字符串。

因此，即使可以在客户端导入并执行`getData()`，它也不会按预期工作。虽然将变量公开会使函数在客户端上工作，但您可能不希望将敏感信息暴露给客户端。

为了防止这种意外的客户端使用服务器代码，如果其他开发人员意外地将这些模块之一导入客户端组件，我们可以使用`server-only`包给他们一个构建时错误。

请看下面的例子

```shell
npm install server-only
yarn add server-only
```

然后将包导入到包含`server-only`代码的任何模块中：

```javascript
import 'server-only'
 
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })
 
  return res.json()
}

```

现在，任何导入`getData()`的客户端组件将获得一个`编译时错误`，告诉开发者，这个模块只能在服务端使用；

相应的包客户端只能用于标记包含`client-only`代码的模块，例如访问窗口对象的代码。

### 使用三方包和Provider

自从服务端组件作为React一个新功能，社区生态的第三发包和Provider开始将"use client"指令添加到那些使用仅客户端可用的功能的组件上，这些功能包括`useState`,`useEffect`,`createContext`等；

但是知道如今，npm中很多只能在客户端上使用的组件依然没有添加这个指令，那些使用了`use client`指令的第三方组件可以如预想的一样在客户端组件上顺利运行，但是他们将不能在服务器组件上运行；

举个例子，假设有一个包叫`acme-carousel`，里面有一个叫`<Carousel/>`的组件，这个组件使用了`useState`，但是他没有添加`use client`指令，这时，如果你在客户端组件中使用了`<Carousel/>`组件，他将顺利运行

```javascript
'use client'
 
import { useState } from 'react'
import { Carousel } from 'acme-carousel'
 
export default function Gallery() {
  let [isOpen, setIsOpen] = useState(false)
 
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>
 
      {/* Works, since Carousel is used within a Client Component */}
      {isOpen && <Carousel />}
    </div>
  )
}
```

然而，如果你将它直接使用在一个服务端组件上，那你将看到一个报错

```javascript
import { Carousel } from 'acme-carousel'
 
export default function Page() {
  return (
    <div>
      <p>View pictures</p>
 
      {/* Error: `useState` can not be used within Server Components */}
      <Carousel />
    </div>
  )
}
```

如果你想修复这个问题，你需要讲这个第三方组件重新包装一下，如下

```javascript
'use client'
 
import { Carousel } from 'acme-carousel'
 
export default Carousel
```

现在，你可以在服务端组件上正常使用`<Carousel/>`

```javascript
import Carousel from './carousel'
 
export default function Page() {
  return (
    <div>
      <p>View pictures</p>
 
      {/*  Works, since Carousel is a Client Component */}
      <Carousel />
    </div>
  )
}
```

我们预计您不需要包装大多数第三方组件，因为您很可能本来就是在客户端场景上，或者在客户端组件中使用它们。然而，Provider是一个例外，因为它们依赖于React状态和上下文，并且通常需要在应用程序的根节点上使用。在下面了解有关第三方上下文（third-party context providers）提供程序的更多信息。

### 使用Context Providers

Context Provider通常在应用程序的根附近呈现，以共享全局关注点，如当前主题。因为React Context在服务端组件中并不支持，所以在你的应用程序中创建一个context会引起错误

```javascript
// app/theme-provider.tsx
import { createContext } from 'react'
 
//  createContext is not supported in Server Components
export const ThemeContext = createContext({})
 
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
      </body>
    </html>
  )
}
```

在一个客户端组件中创建和渲染provider可以解决这个问题

```javascript
// app/theme-provider.tsx
'use client'
 
import { createContext } from 'react'
 
export const ThemeContext = createContext({})
 
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

你的服务端组件将可以直接渲染你的provider当他被标记成一个客户端组件

```javascript
// app/layout.tsx
import ThemeProvider from './theme-provider'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

由于provider在应用程序根部被渲染，所有你应用程序中其他的客户端组件都可以在context中被消费。

> Good to know: 你应该在树中尽可能深的渲染provider，你可能已经注意到了`ThemeProvider`只包含了{children}，而没有包含整个html, 因为这个将使Next.js可以更加简单的优化你服务端组件中的静态部分


### 给类库开发者的建议

通常来说，类库开发者创建的用来给其他开发者使用的包可以使用“use client”指令标记其包的客户端入口点。这将允许包的使用者可以之间在他们的服务端组件中导入这些包，而不用做二次包装；

你可以通过在tree的更深处使用"use client"来优化你的包，这个将更多的部分作为服务端组件模块的一部分；


## 客户端组件模式 Client Components

### 将客户端组件往树的深层次移动

要减少客户端javascript块的大小，我们推荐将客户端组件往树的深层次移动

比如，你可以有一个静态元素的layout，和一个可以使用状态并且可交互的搜索条的方案，以替换将整个layout都作为一个客户端组件，而只将可以交互的搜索条作为客户端组件，这个可以让你的layout保持作为一个服务端组件，这也为这你不必将layout中所有组件的javascript都发往客户端；

```javascript
// SearchBar is a Client Component
import SearchBar from './searchbar'
// Logo is a Server Component
import Logo from './logo'
 
// Layout is a Server Component by default
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <SearchBar />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

### 将Props从服务端传给客户端组件（序列化Serialization）

如果你在一个服务端组件中获取数据，你可以将数据通过props下传给客户端组件。服务端传给客户端组件的props需要通过React被序列化（Serialization）。

如果你的客户端组件依赖的数据无法被序列还，你可以[通过使用客户端上的第三方库来获取数据](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#fetching-data-on-the-client-with-third-party-libraries)或者通过服务端上的[Route Handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

### 交错服务器和客户端组件（Interleaving Server and Client Components）

在交错客户端和服务器组件时，将UI可视化为组件树可能会有所帮助。以Root layout为起点（这是一个服务端组件）你可以通过在给某些子树下的组件添加"user client"命令来让他们在客户端上渲染；

在那些客户端子树中，你依然可以内嵌服务端组件或者调用服务端action，不过你需要讲一些事情铭记在心：

- 在一个请求-相应的周期中，你的代码就从服务端移动到了客户端；如果此时你在客户端上想访问服务端上的数据或者资源，你就需要向服务端重新发起一个新的请求；
- 当一个新的请求发送给服务器，所有的服务端组件将会被第一时间渲染，包括那些内嵌在客户端组件中的服务端组件；这个渲染结果（RSC Payload）将会包含客户端组件的地址的应用。然后，在客户端上，React就会使用RSC Payload来重新协调这些服务端组件和客户端组件，讲他们融入进一棵树；
- ***因为客户端组件是在服务端组件之后渲染的，所以你不能在一个客户端组件中引入一个服务端组件(因为它需要向服务器返回一个新的请求)***。相对的，你可以将服务端组件作为一个`props`传递给一个客户端组件。详情请看下面“不支持的模式”和“支持的模式”；

### 不支持的模式：在客户端组件中引入服务端组件

以下模式是不被支持的。你不能在一个客户端组件中引入一个服务端组件

```javascript
// app/client-component.tsx
'use client'
 
// You cannot import a Server Component into a Client Component.
import ServerComponent from './Server-Component'
 
export default function ClientComponent({
  children,
}: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)
 
  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
 
      <ServerComponent />
    </>
  )
}
```

### 支持的模式：将服务端组件作为属性传递给客户端组件

以下模式是可以支持的：你可以将服务端组件作为属性传递给客户端组件。

一个通用的模式就是使用React的`children`属性，要来在你的客户端组件上创建一个“slot（插槽）”。

在以下的例子中，`ClientComponent`接受一个`children`属性

```javascript
// app/client-component.tsx
'use client'
 
import { useState } from 'react'
 
export default function ClientComponent({
  children,
}: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)
 
  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      {children}
    </>
  )
}
```
