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
