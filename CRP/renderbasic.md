## HTML -> DOM
生成dom的timing是`domInteractive`;
首先在Parse Html的过程中html会遇到一些token，例如`<html>`、`<head>`、`<body>`、`<div>`、`<img/>`、`<input/>`、`</div>`、`</body>`、`</head>`、`</html>`，里面有三种token，这个和具体算法有关，首先说一普通的`<html>`,`<body>`这种类型和`<img/>`，`<input/>`这种类型，两者在进行Parser Html的时候都会直接生成DOM对象，区别在于后者不会包含任何子节点，前后有可能会包含子节点。举个例子：
```
<div>
    <label>A</label>
    <span>B</span>
</div>
```
parse html的顺序也是自上而下，自左到右的过程，当遇到`<div>`的时候，会生成一个div dom对象，然后接下遇到`<label>`，把label作为一个子dom(child)，接着又遇到了`</label>`token，这说明label dom的对象已经闭合，接下来与到dom token都会作为他的同级节点(sibling)，之后遇到了`<span>`token，有生成一个span的dom，然后遇到了</span>，说明了之后遇到dom token作为他的同级节点(sibling)，最后遇到了`</div>`，说明div dom已经闭合，接下来遇到dom token将作为div的同级节点(sibling);所以可见看见`</xxx>`这种类型token的只是用于告诉之后的节点是该闭合节点的同级节点（sibling）

DOM树的顶端是`document`节点，之后看一下，为什么dom树叫树，因为它长成这样：
<img src="./img/domtree.png"/>


## CSS -> CSSOM
[原本地址](https://developers.google.cn/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model?hl=zh-cn)
- CSS和HTML是阻塞渲染的资源：
    - Why：
    首先Html是渲染的内容，如果没有html的内容，就没有内容可以渲染；
    如果没有css的话，渲染出来的内容也很有肯能没有办法使用；
同样css也会生成一个CSSOM的对象，CSSOM是一个css规则的树，他用来和DOM Tree结合

但是何时会生成一个CSSOM


## DOM Tree -> Render Tree
### RenderObject > RenderLayer
- 一个RenderObject总是直接与一个RenderLayer或者间接通过一个祖先RenderObject与一个RenderLayer相联系。
- 共享相同坐标空间的RenderObject（例如受同一css transform影响）通常属于相同的RenderLayer
- 由于RenderLayer的存在，使得页面元素的以正确的顺序合成，从而正确显示重叠的内容和半透明的元素。
- 有许多条件会触发为一个特定的RenderObject创建一个新的RenderLayer，以下使一些通常情况下会创建RenderLayer的条件：
    - RenderObject是一个页面的根元素。
    - 具有明确的CSS位置属性（相对，绝对或变换）
    - 透明的
    - 有overflow，阿尔法掩码（alpha mask）和反射的情况（reflection）
    - 有一个Css filter
    - canvas
    - video元素
- 需要注意的是，RenderObject与RenderLayer不是一一对应的，特定的RenderObject与为其创建的RenderLayer（如果有的话）相关联，或者与第一个祖先的RenderLayer相关联。
- RenderLayers也形成一个树状层次结构。根节点是与页面中的根元素相对应的RenderLayer，并且每个节点的后代都是可视化地包含在父层中的层。每个RenderLayer的子节点被保存在两个按升序排序的排序列表中，negZOrderList包含具有负z-索引（并且因此低于当前图层的层）的子层，而posZOrderList包含具有正z-索引的子层超过当前层的层）。

### RenderLayers -> GraphicsLayers
- 为了使用合成器，一些（但不是全部）RenderLayers获得自己的背面（具有自己的背面的层被广泛地称为合成层）。每个RenderLayer都有自己的GraphicsLayer（如果它是一个合成图层），或者使用它的第一个祖先的GraphicsLayer。这与RenderObject与RenderLayers的关系类似。
- 每个GraphicsLayer都有一个GraphicsContext，供相关联的RenderLayers绘制。该合成器最终负责将GraphicsContexts的位图输出组合在一起，成为后续合成过程中的最终屏幕图像。

    > 在理论上，每一个RenderLayer都可以将其自身绘制成单独的背景表面，实际上这在记忆方面（VRAM尤其如此）可能是相当浪费的。在当前的Blink实现中，必须满足以下条件之一才能使RenderLayer获得自己的合成图层（请参阅[CompositingReasons.h](https://code.google.com/p/chromium/codesearch#search/&q=file:CompositingReasons.h)）：

    - Layer具有3D或透视变换CSS属性；
    - Layer使用加速视频解码的`<video>`元素；
    - Layer由具有3D上下文或加速2D上下文的`<canvas>`元素使用；
    - Layer用于合成插件；
    - Layer使用CSS动画的不透明度或使用动画的Webkit转换；
    - Layer使用加速CSS过滤器；
    - Layer具有作为合成层的后代；
    - Layer具有具有较低z-索引的兄弟姐妹，其具有合成层（换句话说，该层与合成层重叠，并且应该被覆盖在其上）；


### 涂层压缩(Squash Layer)
如上所述，GraphicsLayers在存储器和其他资源方面可能是昂贵的（例如，一些关键操作具有与GraphicsLayer树的大小成比例的CPU时间复杂度）。可以为RenderLayer创建许多其他层，这些层与其自己的背面重叠，这可能是昂贵的。

> repainting:     we need to rerender every pixel and figure out what the color it is(costly), redrawing means we already know the color of pixel and it need to display it(cheap).

### Stacking Contenxt

> Paint order of a stacking Context
 - Backgrounds and borders;
 - Negative z-index children;
 - Normal flow element;
 - z-index == 0 and/or absolute positioned children
 - Postive z-index

### Reasons to Make a Composited Layer
合成可以让渲染子树从缓存和分组中中收益：
- 更容易将某些效果应用于子树
    - e.g. opacity, transforms, filters, reflections

- 元素移动时不会触发重绘
    - e.g. scrolling, fixed-position elements

- 对于需要使用硬件加速的内容更加实用
    - e.g. video, webGL
