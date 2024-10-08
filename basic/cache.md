# Cache

## last-modified

缓存`Last-Modified`是HTTP协议中一个重要的缓存控制机制，它表示资源在服务器上的最后修改时间。当客户端（如浏览器）请求一个资源时，服务器会在响应头中包含`Last-Modified`字段，以告知客户端该资源的最后修改日期和时间。以下是对`Last-Modified`缓存机制的详细解析：

### 基本概念

* **Last-Modified**：HTTP响应头中的一个字段，用于表示资源的最后修改时间。
* **格式**：通常遵循RFC 7231标准，格式为“Last-Modified: <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT”，其中`<day-name>`是星期几（如Mon, Tue等），`<day>`、`<month>`、`<year>`分别是日期，`<hour>`、`<minute>`、`<second>`是时间，GMT表示格林威治时间。

### 工作原理

1. **初次请求**：

   - 客户端（如浏览器）向服务器发送资源请求。
   - 服务器响应请求，并在响应头中包含`Last-Modified`字段，表明资源的最后修改时间。
   - 客户端接收到响应后，保存资源及其`Last-Modified`时间到本地缓存。
2. **后续请求**：

   - 当客户端再次请求同一资源时，它会在请求头中包含`If-Modified-Since`字段，其值为之前保存的`Last-Modified`时间。
   - 服务器收到请求后，会比较请求头中的`If-Modified-Since`时间与资源在服务器上的实际最后修改时间。
   - 如果两者一致，说明资源自上次请求以来未被修改，服务器将返回304 Not Modified状态码，不发送资源内容。
   - 如果不一致，说明资源已被修改，服务器将返回新的资源内容和200 OK状态码。

### 缓存验证与协商

* `Last-Modified`机制允许服务器和客户端之间进行缓存验证和协商，以减少不必要的网络传输，提高页面加载速度。
* 通过这种方式，只有在资源确实发生变化时，客户端才会重新下载资源，否则将直接从本地缓存中获取，从而节省带宽和时间。

### 应用场景

* 适用于静态资源（如图片、CSS、JavaScript文件等）的缓存控制，这些资源通常不会频繁变动。
* 对于动态资源，虽然也可以使用`Last-Modified`进行缓存控制，但可能需要结合其他机制（如ETag）来更准确地判断资源是否发生变化。

### 注意事项

* 确保服务器的时间设置是准确的，因为`Last-Modified`是基于服务器时间来计算的。
* 对于需要频繁更新的资源，应谨慎使用`Last-Modified`进行缓存控制，以避免用户看到过时的内容。

综上所述，`Last-Modified`是HTTP缓存控制机制中的一个重要组成部分，它通过记录资源的最后修改时间来实现缓存验证和协商，从而提高网站性能和节省带宽。

## ETag

缓存ETag是HTTP协议中用于缓存控制的一个重要机制，它允许服务器和客户端之间进行缓存验证和协商，以提高网页加载速度和节省带宽。以下是对ETag缓存机制的详细解析：

### 基本概念

* **ETag**：全称Entity Tag，是HTTP协议中用于标识资源在服务器上的唯一版本的一个标识符。它通常是一个不透明的字符串，由服务器生成，用于表示请求的资源在服务器上的具体版本。

### 工作原理

1. **初次请求**：

   - 客户端（如浏览器）向服务器发送资源请求。
   - 服务器响应请求，并在响应头中包含ETag字段，该字段的值是资源的唯一标识符。
   - 客户端接收到响应后，保存资源及其ETag值到本地缓存。
2. **后续请求**：

   - 当客户端再次请求同一资源时，它会在请求头中包含`If-None-Match`字段，其值为之前保存的ETag值。
   - 服务器收到请求后，会比较请求头中的`If-None-Match`值与资源在服务器上的当前ETag值。
   - 如果两者一致，说明资源自上次请求以来未被修改，服务器将返回304 Not Modified状态码，不发送资源内容。
   - 如果不一致，说明资源已被修改，服务器将返回新的资源内容和200 OK状态码，以及新的ETag值。

### 缓存验证与协商

* ETag机制允许服务器和客户端之间进行高效的缓存验证和协商。通过比较ETag值，服务器可以迅速判断客户端缓存的资源版本是否与服务器上的版本一致，从而决定是否需要发送新的资源内容。
* 这种方式避免了不必要的网络传输，提高了页面加载速度，并节省了带宽。

### ETag的类型

* **强ETag**：表示两个资源表示的内容是逐字节相同的，并且所有其它实体字段（如Content-Language）也未更改。强ETag允许缓存和重组部分响应，如字节范围请求。
* **弱ETag**：仅表明两种表示在语义上是等效的，这意味着出于实际目的它们是可互换的，并且可以使用缓存的副本。但是，资源表示不一定逐字节相同，因此弱ETag不适用于字节范围请求。弱ETag可能适用于Web服务器无法生成强ETag的情况，如动态生成的内容。

### 注意事项

* ETag的生成方法没有统一规定，但应保证每个ETag值是唯一的，以避免使用过期的缓存数据。
* 在分布式系统中，不同服务器可能生成不同的ETag值，这可能导致缓存失效。此时，需要确保不同服务器基于相同的资源内容生成相同的ETag值。
* ETag通常与Last-Modified头部一起使用，以提供更全面的缓存验证机制。

综上所述，ETag是HTTP缓存控制中的一个重要机制，它通过允许服务器和客户端之间进行缓存验证和协商，提高了网页加载速度和节省了带宽。在实际应用中，合理使用ETag机制可以显著提升网站的性能和用户体验。

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

## Expires

缓存Expires是HTTP协议中一个重要的头部字段，用于设置资源的过期时间。当浏览器接收到一个包含Expires头部的HTTP响应时，它会将资源及其过期时间保存在缓存中。在之后的请求中，如果浏览器发现缓存中的资源尚未过期，它将直接使用缓存中的资源，而无需向服务器发送请求，从而提高了加载速度和减少了服务器的负担。

### Expires的基本概念和原理

* **基本概念**：Expires是一个HTTP/1.0的头部字段，用于指定资源的过期时间。该时间是一个GMT（格林威治时间）格式的日期和时间。
* **原理**：浏览器在接收到包含Expires头部的HTTP响应后，会将资源的副本及其过期时间存储在缓存中。在后续的请求中，浏览器会检查缓存中资源的过期时间。如果当前时间未超过过期时间，浏览器将直接从缓存中提供资源，而不是向服务器发送请求。

### Expires的设置和使用

* **设置方式**：Expires头部通常由服务器在HTTP响应中设置。例如，服务器可能会发送一个类似于“Expires: Thu, 19 Nov 1981 08:52:00 GMT”的头部，指示资源在1981年11月19日之前都是有效的。
* **使用场景**：Expires非常适合于不经常变动的资源，如图片、CSS和JavaScript文件等。通过为这些资源设置较长的过期时间，可以显著减少对服务器的请求次数，提高网站的加载速度和性能。

### Expires与Cache-Control的关系

* **区别**：虽然Expires和Cache-Control都用于控制资源的缓存行为，但它们是HTTP协议中不同版本的头部字段。Expires是HTTP/1.0的头部字段，而Cache-Control是HTTP/1.1引入的更为强大和灵活的头部字段。
* **兼容性**：由于Cache-Control提供了更多的控制选项和更好的兼容性，现代Web开发中更倾向于使用Cache-Control来替代Expires。然而，在一些旧系统或旧浏览器中，Expires仍然是必要的。
* **优先级**：如果HTTP响应中同时包含了Expires和Cache-Control头部，Cache-Control的指令将具有更高的优先级。

### 注意事项

* **服务器时间**：确保服务器的时间设置是准确的，因为Expires是基于服务器时间来计算的。如果服务器时间不准确，可能会导致缓存失效或资源被意外地缓存过长时间。
* **资源变动**：对于经常变动的资源，不建议使用Expires进行缓存。相反，应该使用更灵活的缓存控制策略，如Cache-Control的no-cache指令，以确保浏览器在每次请求时都验证资源的有效性。

综上所述，Expires是HTTP协议中用于控制资源缓存过期时间的重要头部字段。通过合理设置Expires头部，可以显著提高网站的加载速度和性能。然而，在现代Web开发中，Cache-Control由于其更强的功能和更好的兼容性而被更广泛地使用。

## 优先级

* 强制缓存（Cache-Control和Expires）的优先级高于协商缓存（ETag和Last-Modified）。
* 在强制缓存中，Cache-Control的优先级高于Expires。
* 在协商缓存中，ETag的优先级高于Last-Modified。
* Cache-Control -> Expires
* Etag -> Last-Modified
