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
