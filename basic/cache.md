# Cache

## last-modified

## ETag

## cache-control

cache-control有四种 private，public，no-cache， no-store

* **private**：表示响应只能被终端用户的浏览器缓存，不允许中间缓存代理进行缓存。
* **no-cache**：表示不使用本地强缓存，需要使用缓存协商。即每次请求时，都会向服务器发送请求，但服务器可能会返回304状态码，表示资源未修改，可以使用缓存版本。
* **no-store**：直接禁止浏览器缓存数据，每次用户请求该资源，都会向服务器发送一个请求，并下载完整的资源。
* **public**：表示响应可以被所有的用户缓存，包括终端用户和中间代理服务器。
* **max-age**：指定资源在客户端缓存的有效时间（秒），是一个相对时间。例如，`Cache-Control: max-age=3600`表示资源在客户端缓存1小时。
* **s-maxage**：与max-age类似，但仅适用于供多位用户使用的公共缓存服务器（如CDN）。
* **must-revalidate**：指示缓存必须在使用之前验证其有效性，如果无法验证，则必须从源服务器重新获取资源。

`private` 只允许在客户端上进行缓存

`public`允许在服务器上进行缓存

`no-cache` 不要进行相信本地缓存，去远程查一下，这里要结合last-modified

`no-store` 禁止缓存

`max-age` 可以结合private和public如：

```
# response header
# 表示在本地缓存一分钟，
Cache-Control: private, max-age=3600
```

## expires



## 优先级


* 强制缓存（Cache-Control和Expires）的优先级高于协商缓存（ETag和Last-Modified）。
* 在强制缓存中，Cache-Control的优先级高于Expires。
* 在协商缓存中，ETag的优先级高于Last-Modified。
