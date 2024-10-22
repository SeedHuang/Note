# 错误处理(Error Handling)

错误可以被分成两个类别：预期错误(expected errors)以及未捕获错误(uncaught exceptions):

- 将预期错误(expected errors)建模为返回值：避免在服务器操作中对预期错误使用`try/catch`。使用`useFormState`管理这些错误并将其返回给客户端。
- 对意外错误(uncaught exceptions)使用`error-boundary`：使用error.tsx和global-error.tsx文件实现错误边界，以处理意外错误并提供回退UI。

## 处理预期错误
