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

### 使用三方包和提供者

自从服务端组件作为React一个新功能，社区生态的第三发包和提供者开始将"use client"指令添加到那些使用仅客户端可用的功能的组件上，这些功能包括`useState`,`useEffect`,`createContext`等；

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
