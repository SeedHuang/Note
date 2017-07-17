# What's layers

前端遇见最多的事情就是渲染了，比如改变大小，改变颜色，或者插入一个新节点。都会促使屏幕上的显示内容发生变化，那我们来看一下，在这些操作过程中到底都发生了一些什么？

## 从DOM到GraphicsLayer Tree
这是一个复杂的过程：下图简单的讲述了这个过程，当中还涉及到其他优化的知识，我们稍后再继续深入。
<img src="./img/layers.png" style="background:white"/>

我们来看一下和前端最有关的RenderLayer和GraphicsLayer，在一些情况下RenderLayer和GraphicsLayer是可以转换的，我们来深入了解一下：
- 滚动：
不论是body上的滚动还是，单独容器上的滚动，都会产生两个GrahicsLayer，一个layer适用于存放容器的层，一个layer是用用于存放滚动内容的layer。这样做的原因是用来提高滚动时的性能。

<img src="./img/scroll.png" style="max-width:300px"/>

- “position:absolute, relative, fixed, sticky”,“opacity”,“reflection”
这些属性如果是单独在页面显示的情况下是不会出现单独的GraphicsLayer，触发的效果都是这些属性位于一个GraphicsLayer之上，而“transform”和“scroll”类型都是可以自己单独成层的，并且这些分层的效果不太一样；
    - 合并同类项型
    - 各自为营型
        - fixed:
        <img src="./img/fixedposition.png" style="max-width:400px"/>
