# 怎样使用“层”才能提高渲染性能？

作者：黄春华

## Why?
前端每天都在和渲染打交道，比如改变大小，改变颜色，或者插入一个新节点，都会促使屏幕上的显示内容发生变化，而这些变化都会体现在层上。优化层的使用作为是主要的性能优化点之一，主要工作就是通过了解层的产生与合并的原因进行合理优化，所以了解层的运作机制就好比读懂武器说明一样重要。

### What's Next?
在了解什么是层之前，我们先来了解一下，从`Html Parse`->`GraphicsLayer Tree`在这些操作过程中到底都发生了一些什么？

## 从DOM到GraphicsLayer Tree
这是一个复杂的过程：下图简单的讲述了这个过程。
<img src="./img/layers.png?t=2" style="background:white"/>

## Layer的形成条件
从上文看见整个形成过程中，只有两种层，一种是`RenderLayer`（负责DOM子树），一种是`GraphicsLayer`（负责RenderLayer子树），对两者形成的条件进行比较

RenderLayer             | GraphicsLayer
------------------------|----------------------
页面元素的根目录           | #document
`RenderObject`具有`position` 样式属性的。         | `RenderLayer`覆盖在一个同级`GraphicsLayer`之上，`RenderLayer`的`z-index`大于`GraphicsLayer`。
`RenderObject`有透明效果 | `RenderLayer`使用CSS动画、`opacity`< 1
`RenderObject`具有overflow,alpha或者反射效果的节点 | `RenderLayer`具有`Reflection`样式属性。
`RenderObject`使用Canvas2D和3D（WebGL）技术的`RenderObject`节点 | `RenderLayer`为`canvas`，并满足三个条件
`RenderObject`是`video`节点 | `RenderLayer`是video并有一个有效源
`RenderObject`具`有css filter` 样式属性    |`RenderLayer`使用了硬件加速CSS Filters技术
`RenderObject`具有`transform` 样式属性     |`RenderLayer`具有CSS 3D属性

> `opacity:1` 是不能提升成为`GraphicsLayer`的

> fixed元素本身并不会产生单独的`GraphicsLayer`，当`body`的内容产生溢出可以滚动的时，或者它覆盖在一个`GraphcisLayer`之上时，才会成为`GraphicsLayer`

> 更加详细形成`GraphicsLayer`的原因请参考source code[CompositingReasons.cpp](https://chromium.googlesource.com/chromium/src/+/master/third_party/WebKit/Source/platform/graphics/CompositingReasons.cpp)

## 为什么要有RenderLayer和GraphicsLayer
可以看的出，`GraphicsLayer`比`RenderLayer`定义的更加严谨，在满足一定条件的情况下`RenderLayer`可以转换成`GraphicsLayer`，为什么要有`RenderLayer`和`GraphicsLayer`，本身`RenderLayer`就可以承载渲染所需要的渲染条件了，但是`GraphicsLayer`存在是为更加高效的进行渲染。
- 数量上`GraphicsLayer`的数量比`RenderLayer`数量更少，在进行一些页面元素的复杂操作时，需要尽可能少的触发`Paint`但又不能在`#document`上触发一个`Paint`。所以对`RenderLayer`在进行合理分组得到的`GraphicsLayer`显然更符合需求。
- 图层操的高效，无论是`GraphicsLayer`还是`RenderLayer`都会经历一次`Paint`的过程（`GraphicsLayer`本身来自于RenderLayer），观察`Performance`就可以观察到有几个`GraphicsLayer`就有几次`Paint`，但是一旦`GraphicsLayer`形成，只要层内容本身不变，对单个图层进行位置（top,right,bottom,left）变换、透明度或者是3D transform的此类操作的性能就体现出来
<table>
    <tr>
        <th>GraphicsLayer(top/right/bottom/left)</th>
        <th>RenderLayer(top/right/bottom/left)</th>
        <th>优势</th>
    </tr>
    <tr>
        <td><img src="./img/vsleft1.png"/></td>
        <td><img src="./img/vsleft2.png"/></td>
        <td>没有Paint</td>
    </tr>
    <tr>
        <th>GraphicsLayer(opacity)</th>
        <th>RenderLayer(opacity)</th>
        <th>优势</th>
    </tr>
    <tr>
        <td><img src="./img/vsopacity1.png?t=1"/></td>
        <td><img src="./img/vsopacity2.png"/></td>
        <td>没有paint</td>
    </tr>
    <tr>
        <th>GraphicsLayer</br>(background/transform2d)</th>
        <th>RenderLayer</br>(background/transform2d)</th>
        <th>优势</th>
    </tr>
    <tr>
        <td><img src="./img/vsscroll1.png"/></td>
        <td><img src="./img/vsscroll2.png"/></td>
        <td>N/A</td>
    </tr>
    <tr>
        <th>GraphicsLayer(width)</th>
        <th>RenderLayer(width)</th>
        <th>优势</th>
    </tr>
    <tr>
        <td><img src="./img/vswidth1.png"/></td>
        <td><img src="./img/vswidth2.png"/></td>
        <td>N/A</td>
    </tr>
    <tr>
        <th>GraphicsLayer(transform3d)</th>
        <th>RenderLayer(transform3d)</th>
        <th>优势</th>
    </tr>
    <tr>
        <td><img src="./img/vstransform1.png"/></td>
        <td>N/A</td>
        <td>具有`transform3d`属性的`RenderLayer`必定是`GraphicsLayer`，所以没有比较对象，但是可以看出，`transform3d`没有任何`Layout`和`Paint`，这一点上和`GraphisLayer`的`opacity`表现一致，都是最节省资源的方式</td>
    </tr>
</table>

从上述场景进行对比，可以看到，GraphicsLayer来进行transform和opacity非常节省资源，主要的差别在于Layout与Paint

> GPU是专门处理图像的，对于GPU来说合并图像比重绘图像要高效的多

#### 简述渲染的4个过程
- **Recalculate Style**: 此阶段用以与CSSDOM结合计算所有可见节点的样式信息。
> 事件与 DOM 解析不同，该时间线不显示单独的`Parse CSS`条目，而是在这一个事件下一同捕获解析和`CSSOM`树构建，以及计算的样式的递归计算。[参考:Constructing the Object Model](https://developers.google.cn/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model?hl=zh-cn)

- **Layout**：计算可见节点在设备`viewport`的确切位置和大小，这个就是layout的任务[参考:Render-Tree Construction, Layout, and Paint](https://developers.google.cn/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=zh-cn)。

- **Update Layer Tree**：检查以及更新`GrapicLayerTree`的结构的，每一次用户操作，如：滚动、动画、改变长宽、显示隐藏节点都会触发`Update Layer Tree`。

- **Paint**：需要计算每一个`GraphicsLayer`中的每一个像素的颜色，并把它打印在一个SKPicture上(就是一张图)。

- **Composite Layers**：将所有的`GraphicsLayer`进行组合，把它们最后`Draw`在一张图像上。最后光栅化到屏幕上。与`Update Layer Tree`一样，每次有操作都会触发`Composite Layers`

> 这里需要注意的是，Composite Layers的过程远远比我们这里说的要复杂，并且涉及到许多GPU操作，这里我们不做过多的深入探讨。

#### Draw vs Paint
`Draw`和`Paint`。这两字很容易混淆，首先字面理解，`Paint`对应的彩色的绘画，如油彩画，而draw对应的是显色更简单的铅笔画，如素描。paint你需要知道每一个像素的颜色，而`Draw`并不用知道，只管用规定的颜色化就可以了。这就是为什么`Draw`比`Paint`更快的原因————“不用根据样式条件再去计算每个像素的颜色”。

##### 如果说有什么最能体现Draw性能上优越性，最好的例子就是滚动：
`body`的滚动与`DOM`节点内的滚动（如一个`div`的内容溢出产生滚动）稍有不同，`DOM`节点上的滚动，都会产生两个`GrahpicsLayer`，一个用于存放容器的层，一个用于存放滚动内容。`body`滚动只会产生一个`GraphicsLayer`，但是不论是`body`上的滚动还是`DOM`节点上的滚动，结果是一致的：

<img src="./img/scroll.png" width="400px"/>

通过performance记录我们发现`scroll`的动作只会产生`Update Layers Tree`和`Composite Layers`的操作。这两个

<img src="./img/scrollcompsitelayer.png" width="500px"/>

在滚动的过程中没有产生任何`Paint`，只有`Update Layer Tree`和`Composite Layers`,所以极大的提高了性能。

> 许多浏览器会在body滚动上进行优化，所以并不用担心其性能，几乎所有的浏览器，body滚动性能都比DOM节点上的滚动表现更好

> 所以本着好到用在刀刃上的原则，`GraphicsLayer`会用本身内容偏向稳定，而使用场景偏复杂的一些场景上。

## 层的3维空间
### 同一平面上的层
<img src="./img/plainlayer.png" width="500px" style="background:#fff"/>

`container`是一张桌子，`RenderObject`是桌子上的花纹，而`RenderLayer`是摆在桌子上的牌，都是一个平面上的东西。所以同样都是`z-index`为0，`RenderLayer`有着比普通`RenderObject`更高的显示优先级，因为普通的`RenderObject`是属于`container`这一层的`layer`，也就是最底层。

#### z-index
那是不是`RenderObject`的显示优先级永远也无法比`RenderLayer`高了呢？不是这样的，之前提到过`z-index:0`的这个概念，对于有position概念的`RebderLayer`,你可以将他的`z-index`设置为-1

<img src="./img/plainlayer2.png" width="500px" style="background:#fff"/>

台子的花纹全都到上面来了，相当于放到了台板的背面。但是非`position`类型的`RenderLayer`是无法做到这一点的。

### 重叠
`z-index`对于`RenderLayer`主要影响在于重叠，而重叠的主要后果在于两个：`RenderLayer`的合并以及升级。
#### `RenderLayer`升级`GraphicsLayer`的策略。
之前的对照表中详细说明了`RenderLayer`和`GraphicsLayer`的形成原因，其中，如果一个带有`position:relative,absolute`的`RenderLayer`如果覆盖在一个`GraphicsLayer`之上，这个`RenderLayer`就会被升级为`GraphicsLayer`，升级实际上是一个非常花费资源的操作，比如在做动画的时候，从`RenderLayer`升级到`GraphicsLayer`会对动画执行速度产生延时，请看例子：
以下每个绿色的圆形都是一个`position:relative`的`RenderLayer`，红色区域是一个`position:fixed`的`GraphicsLayer`

<img src="./img/scrollc1.png?t=5" style="background:#fff" width="500px"/>

上图中第一个图层3D模型中可以看到一共有4个`GraphicsLayer`

```
#document(292 x 2100)
.fixed(292 x 150)
.r(50 x 50)
.r(50 x 100)
```

`#document`是根层，`.fixed`是一个`position:fixed`的层，`.r(50 x 50)`是`opacity:0.5`的层，`.r(50 x 150)`是一个3个`.r(50 x 50)`合并而来；`.r`都是因为覆盖在`.fixed`之上而形成的`GraphicsLayer`，所以其他没有覆盖其上的'.r'都没有形成对应的`GraphicsLayer`


在滚动的过程中，由于`.fixed`的位置固定，会经历许多`.r`从`.fixed`的上方经过的过程，按照`GraphicsLayer`形成原理会多次形成`GraphicsLayer`；以下描述了滚动中出现的三种情况：

<img src="./img/scrollc.png?t=1" style="background:#fff"/>

- case1:之前已经描述过，这里不再累述
- case2:是向上滚动，原本未覆盖的`RenderLayer`进入了`.fixed`的上方，所以会触发`Update Layer Tree`，然后触发三次`Paint`，最后触发`Composited Layers`；我们来查看一下`performance`:
<img src="./img/scrollp1.png" width="500px"/>

这里可以看到三个`paint`:

<table>
    <tr>
        <td>
        Location (0, -51);
        <nobr>Dimemsions (292 x 2100);</nobr>
        Layer Root #document;
        </td>
        <td>
        Location (0, -1);
        <nobr>Dimemsions (50 x 50);</nobr>
        Layer Root div.r
        </td>
        <td>
        Location (0, -51);
        <nobr>Dimemsions (50 x 150);</nobr>
        Layer Root div.r
        </td>
    </tr>
</table>

当第一个`.r`完全移出`.fixed`的范围之后，又会出现3次`Paint`，主要主要是因为，原本单独的 `.r`层因为不在`.fixed`之上的范围，所以重新被合入到`#document`之中，而原本的`.r (50 x 150)`又会分离出一个`.r (50 x 50)`和`.r (50 x 100)`两个层,所以一共有3个`GraphicsLayer`的内容产生了改变，所以产生了3次`Paint`:

<img src="./img/scrollp2.png" width="500px"/>

<table>
    <tr>
        <td>
        Location (0, -100);
        <nobr>Dimemsions (292 x 2100);</nobr>
        Layer Root #document;
        </td>
        <td>
        Location (0, 0);
        <nobr>Dimemsions (50 x 50);</nobr>
        Layer Root div.r
        </td>
        <td>
        Location (0, -51);
        <nobr>Dimemsions (50 x 100);</nobr>
        Layer Root div.r
        </td>
    </tr>
</table>

之前曾经说过，`Paint`由于需要计算每个像素的颜色，所以非常消耗资源，而在滚动中快速触发这种`Update Layer Tree`、`Paint`、`Paint`、`Paint`、`Compsite Layers`这种过程造成的性能消耗也是可想而知（有时会出现合并层的来不及显示的过程），如下图:

<img src="./img/scrollp3.png"/>

##### 何解决这个问题？
答案非常简单，可以将`.fixed`的node节点置于`.r`之后，或者直接提升或'.fixed'的`z-index`属性，两个方案的实质上都是提升了`z-index`；只要让覆盖在一个`GraphicsLayer`之上的条件失效就可以了。


#### GraphicsLayer的(Squashing)合并与(SquashingDisallowed)独立
并不是每一个GraphicsLayer都是独立的，为了减少多次`Paint`所带来的消耗`GraphicsLayer`之间也会有合并。

> 以下所提到的合并和独立类型并不完整，欢迎大家补充。

##### 合并类型（relative／absoluste／opacity／mask／transform2d）:
<img src="./img/clayer1.png" width="500px" style="background:#fff"/>

第一个会单独形成一个`GraphicsLayer`，其余同种类型会合成一个`GraphicsLayer`。

> relative/opacity混合效果也是一样的

<img src="./img/clayer2.png?t=1" width="500px" style="background:#fff"/>


##### 独立型（各自为营）型 `fixed`／`transform`／`animation`／`relection`／`will-change:transform,opacity`/`overflow:scroll`／`canvas`／`video`:

<img src="./img/squash2.png"  width="500px"/>

`scroll`与其他的独立层方式不同，内容移出产生滚动，会产生两个独立层;

<img src="./img/scrolllayer.png" width="500px"/>

> chrome source关于squashDisallowed的更为详细的解释[原文:SquashingDisallowedReasons.cpp](https://chromium.googlesource.com/chromium/src/+/master/third_party/WebKit/Source/platform/graphics/SquashingDisallowedReasons.cpp)


> ***will-change*** 是chrome59以上的一个功能，作用是会给一个未来有个能做animation/transform/opacity变化的元素生成一个单独的`GraphicsLayer`，以免在动画开始的时候计算分离出单独的`GraphicsLayer`，这样会产生延迟。

### GraphicsLayer是否越多越好？
答案是No，Absolutely not，其实大家看到，就浏览器本身实现也分成合并型和独立型两种，其目的就是在于更好的节省资源和更好的性能体验，在dom数量一致的情况下，出现多个`GraphicsLayer`和只有一个`GraphicsLayer`的性能比较：

***内容部分***

```
<body>
        <div class="content">白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼</div>
        <div class="content">白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼</div>
        <div class="content">白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼</div>
        <div class="content">白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼</div>
        <div class="content">白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼</div>
        <div class="content">白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼</div>
        <div class="content">白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼</div>
        <div class="content">白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼</div>
        <div class="content">白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼</div>
        <div class="content">白日依山尽，黄河入海流，欲穷千里目，更上一层楼；白日依山尽，黄河入海流，欲穷千里目， 更上一层楼；白日依山尽，黄河入海流，欲穷千里目，更上一层楼
        </div>
</body>
```

***数据对比***

来看一下layer数量对性能的影响
<table>
    <tbody>
        <tr>
            <td colSpan="2">Performance table</td>
        </tr>
        <tr>
            <td style="vertical-align:top;"><img src="./img/lay_more.png"/></td>
            <td style="vertical-align:top;"><img src="./img/layer_one.png"/></td>
        </tr>
        <tr>
            <td colSpan="2">Layer Veiw</td>
        </tr>
        <tr>
            <td style="vertical-align:top;"><img src="./img/layer_1.png"/></td>
            <td  style="vertical-align:top;"><img src="./img/layer_2.png"/></td>
        </tr>
    </tbody>
</table>

每个`Paint`都意味着有一个`GraphicsLayer`产生，否则只会有一个`GraphicsLayer`————`#document`，可以从性能对比中看到，`GraphicsLayer`越多，`Paint`的次数也越多，并且`Composite Layers`的时间也就越长，对于首屏展现来说，是非常不利的。

## 总结
了解层的运作原理对于前端有着非常重要意义，通过优化层的覆盖关系，了解层的合并原理，合理使用层可以增加首屏渲染速度以及提示高用户使用过程中的流畅程度，是每一个前端都必须要好好研究的。

## 参考
- 朱永盛《Webkit技术内幕》第7章渲染基础 P164，硬件加速基础 P186
- [Tom Wiltzius《Accelerated Rendering in Chrome》](https://www.html5rocks.com/zh/tutorials/speed/layers/)
- [Ilya Grigorik 《渲染树构建、布局及绘制》](https://developers.google.cn/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=zh-cn)
- [Tom Wiltzius, Vangelis Kokkevis & the Chrome Graphics team《GPU Accelerated Compositing in Chrome
》](http://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome)
- [SquashingDisallowedReasons.cpp](https://chromium.googlesource.com/chromium/src/+/master/third_party/WebKit/Source/platform/graphics/SquashingDisallowedReasons.cpp)
