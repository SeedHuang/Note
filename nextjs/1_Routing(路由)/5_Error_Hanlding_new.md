# 错误处理(Error Handling)

错误可以被分成两个类别：预期错误(expected errors)以及未捕获错误(uncaught exceptions):

- 将预期错误(expected errors)建模为返回值：避免在服务器操作中对预期错误使用`try/catch`。使用`useFormState`管理这些错误并将其返回给客户端。
- 对意外错误(uncaught exceptions)使用`error-boundary`：使用`error.tsx`和`global-error.tsx`文件实现`error boundary`，以处理意外错误并提供`fallback UI`。

## 处理预期错误

预期错误是那些在应用程序日常操作中发生的错误，比如那些[服务度端验证信息](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#server-side-form-validation)或者请求失败。这些错误应明确处理并返回给客户端。

## 处理服务端操作的预期错误

使用`useFormState`钩子来管理服务端动作状态，包含处理错误。这种方法避免了预期错误的`try/catch`块，这些错误应该被建模为返回值，而不是抛出的异常。

```javascript
// app/actions.ts
'use server'
 
import { redirect } from 'next/navigation'
 
export async function createUser(prevState: any, formData: FormData) {
  const res = await fetch('https://...')
  const json = await res.json()
 
  if (!res.ok) {
    return { message: 'Please enter a valid email' }
  }
 
  redirect('/dashboard')
}
```

然后，您可以将操作传递给`useFormState`挂钩，并使用返回的状态显示错误消息。

```javascript
// app/ui/signup.tsx

'use client'
 
import { useFormState } from 'react'
import { createUser } from '@/app/actions'
 
const initialState = {
  message: '',
}
 
export function Signup() {
  const [state, formAction] = useFormState(createUser, initialState)
 
  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      {/* ... */}
      <p aria-live="polite">{state?.message}</p>
      <button>Sign up</button>
    </form>
  )
}
```

> 小贴士：这些例子就是使用React的和`Next.js`的`App Router`绑定的`useFormState`钩子，如果你使用React19，请使用`useActionState`，详情查看[React docs](https://react.dev/reference/react/useActionState)

您还可以使用返回的状态来显示来自客户端组件的吐司消息。

### 处理服务器组件的预期错误(Handling Expected Errors from Server Components)

在服务器组件中获取数据时，您可以使用响应有条件地呈现错误消息或[重定向(redirect)](https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function)。

```javascript
// app/page.tsx
export default async function Page() {
  const res = await fetch(`https://...`)
  const data = await res.json()
 
  if (!res.ok) {
    return 'There was an error.'
  }
 
  return '...'
}
```

## 没有捕获的错误（Uncaught Exceptions）

未捕获的异常是指意外错误，表示在应用程序的正常流程中不应出现的错误或问题。这些应该通过抛出错误来处理，然后这些错误将被`error boundary`捕获。

- 通常情况下：`root layout`下的`error.js`来捕获未处理的错误；
- 可选的：使用嵌套的`error.js`文件（例如`app/dashboard/error.js`）处理细粒度的未捕获错误;
- 特殊情况：由`global-error.js`来处理未捕获的错误；

### 使用Error Boundaries(错误边界)

Next.js使用`Error Boundary`来处理未捕获的错误。`Eorr Boundary`可以捕获他们自组件的错误并且显示一个`fallback` UI替代组件树崩溃的时候；

在一个路由片段中添加一个`error.tsx`来创建一个`Error Boundary`；

```javascript
// app//dashboard/error.tsx

'use client' // Error boundaries must be Client Components
 
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

如果希望错误上升到父`Error Boundary`，可以在渲染错误组件时`throw`。


### 在嵌套路由中处理错误(Handling Error in Nested Routes)

错误将上升到最近的父`Error Boundary`。这允许通过将`error.tsx`文件放置在路由层次结构的不同级别来进行精细的错误处理。

![1729604166255](images/5_Error_Hanlding_new/1729604166255.png)

### 处理全局错误(Handling Global Errors)

虽然不太常见，但您可以使用位于根应用目录中的`app/global-error.js`处理根布局中的错误，即使在利用国际化时也是如此。全局错误UI必须定义自己的`<html>`和`<body>`标签，因为它在活动时会替换`Root layout`或`template`。

```javascript
// app/global-error.tsx

'use client' // Error boundaries must be Client Components
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```
