CRP - Critical Render Path:关键性渲染步骤

# 从浏览器接收到第一个的html字节开始起，浏览器做了什么事情

- Receive Data: 不断的接收html数据，只是完成html的数据的下载
- Parse Html: 将Html字符串转化为token，再转化为对应的dom
    - SendRequest: Send js Request，如果内连就没有；
    - SendRequest: Send css Request，如果内连就没有；
    - SendRequest: Send img Request，如果内敛就没有；

- domLoading：这是整个过程的起始时间戳，浏览器即将开始解析第一批收到的 HTML 文档字节。
- domInteractive：表示浏览器完成对所有 HTML 的解析并且 DOM 构建完成的时间点。
- domContentLoaded：表示 DOM 准备就绪并且没有样式表阻止 JavaScript 执行的时间点，这意味着现在我们可以构建渲染树了。
    - 许多 JavaScript 框架都会等待此事件发生后，才开始执行它们自己的逻辑。因此，浏览器会捕获 EventStart 和 EventEnd 时间戳，让我们能够追踪执行所花费的时间。
- domComplete：顾名思义，所有处理完成，并且网页上的所有资源（图像等）都已下载完毕，也就是说，加载转环已停止旋转。
- loadEvent：作为每个网页加载的最后一步，浏览器会触发 onload 事件，以便触发额外的应用逻辑。
HTML 规范中规定了每个事件的具体条件：应在何时触发、应满足什么条件等等。对我们而言，我们将重点放在与关键渲染路径有关的几个关键里程碑上：
- domInteractive 表示 DOM 准备就绪的时间点。
- domContentLoaded 一般表示 DOM 和 CSSOM 均准备就绪的时间点。
    - 如果没有阻塞解析器的 JavaScript，则 DOMContentLoaded 将在 domInteractive 后立即触发。
    domComplete 表示网页及其所有子资源都准备就绪的时间点。

# 如何形成Render Tree
Render Tree适用于最后渲染到页面上的树状结构，是DOM Tree和CSSOM tree结合的产物，所以可以预见的问题是，假设出现以下布局就会阻断延迟Render Tree的形成
```
<!DOCTYPE HTML>
<html>
    <head>
        <link type="text/css" rel="styleSheet" href="./index.css"/>
    </head>
    <body>
        <div>
            <p>
                <span>SPAN</span>
                <label>LABEL</label>
            </p>
        </div>
    </body>
</html>
```
## Render树的形成
Render树是在`Recalculate style`产生的，Recalculate的范围就是根据从跟节点开始，根据现有DOM结构，对照`CSSOM`结构，开始生成匹配的`Render Tree`（对于匹配规则当中，如果当前节点的display为none，当前节点和他的子节点就不不会出现在render树当中),但是需要主要注意的是`Recalculate Style`事件与 DOM 解析不同，该时间线不显示单独的`Parse CSS`条目，而是在这一个事件下一同捕获解析和`CSSOM`树构建，以及计算的样式的递归计算。[参考:Constructing the Object Model](https://developers.google.cn/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model?hl=zh-cn)

## Layout
`Recalculate style`计算所有可见节点样式信息，但是尚未计算它们在设备`viewport`的确切位置和大小，这个就是layout的任务[参考:Render-Tree Construction, Layout, and Paint](https://developers.google.cn/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=zh-cn)
