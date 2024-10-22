# 错误处理(Error Handling)

`error.js`文件约定可以让你很优雅的处理在[嵌套路由](../1_Routing(路由)/1_Defining_Routes.md#嵌套路由)中的不可预期的运行时错误

- 自动将路由片段及其嵌套子段包装在React错误边界中。
- 使用文件系统层次结构调整粒度，对一置顶的路由片段创建一个错误UI。
- 隔离错误的影响片段并且保障其余的应用程序正常运行；
- 添加功能，尝试在不重新加载整个页面的情况下从错误中恢复。

通过在路由片段中创建一个`error.js`并导出React组件来创建一个错误UI。

![1729496737584](images/5_Error_Handling/1729496737584.png)

```java
// app/dashboard/error.tsx

'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
```

## `error.js`是怎样工作的？

![1729496870819](images/5_Error_Handling/1729496870819.png)

- `error.js`自动创建了一个[React Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary),他被包裹在一个子片段中或者`page.js`组件中
- 从`error.js`导出的React组件被用于fallback组件。
- 如果一个错误由`error boundary`抛出，则包含错误，并呈现回退组件。
- 当fallback error组件被激活，`error boundary`之上的layout将保持他们的状态以及可交互，错误组件可以显示从错误中恢复的功能。


## 接受错误

错误的原因有时可能是暂时的。这种情况下，简单的重试可能就能解决问题；

一个错误组件可以使用`rest()` 功能来提示用户可以尝试从错误中恢复过来。当执行的时候，这个功能将尝试重新渲染`Error boundary`的内容。如果成功了，`fallback error`组件就会被重新渲染的结果代替。

```javascript
// app/dashboard/error.tsx

'use client'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

## 嵌套路由(Nested Routes)

嵌套组件层次结构对嵌套路由中error.js文件的行为有影响：错误会上升到最近的父`error bonundary`。这意味着error.js文件将处理其所有嵌套子段的错误。通过将error.js文件放置在路由的嵌套文件夹中的不同级别，可以实现或多或少粒度的错误UI。

`error.js`边界将不会处理`layout.js`抛出的错误，因为在同一个路由片段下，`error boundary`是嵌套在`layout`组件中的。


## 在layout中处理错误(Handling Error in layouts)

`error.js`boundaries不会catch相同路径片段中`layout.js`组件和`template.js`组件中的错误。[意图层册(Intentional hierarchy)](https://nextjs.org/docs/app/building-your-application/routing/error-handling#nested-routes)使在发生错误时在兄弟路线之间共享的重要UI（如导航）可见且可用。

要处理一个专门的`layout`或者`template`，那就在layout的父路由片段所在文件夹下面添加一个`error.js`

如果要处理`root layout`或者`template`，那就使用一个名为`global-error.js`的`error.js`的变体

## 处理Root layouts的Errors(Handling Errors in Root Layouts)

根 `app/error.js`boundary不会catch在根`app/layout.js`或者`app/template.js`组件中的错误。

如果要专门处理这些根组件的错误，需要使用一个变形的`error.js`，它是在根目录`app`下`app/global-error.js`。

不像根`error.js`，这个`global-error.js`的`error boundary`包含整个应用，并且它的`fallback component`被激活的时候会替换掉`root layout`。
