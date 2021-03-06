# 探究渲染

渲染是身为一个前端每天所必须会碰到的一个一件事情，在没有做这个专题之前，他对我来说是既熟悉又陌生，希望在做完这个专题之后，我对渲染认识会有一个质的提升，并帮助到所有对渲染渲染有兴趣的同学们。

在探究的过程中发现，渲染的确博大精深，其中关于“层合并”、“浏览器兴趣区”、“激活区”、“未激活区”、“棋盘策略”、“CPU与GPU通信机制”等等，让我感觉到，我每天使用的浏览器，看似简单，其实太复杂了，而想要了解它，只能自己不断的进行探究，过程中遇见了很多的弯路，不过还好，我还有许多大神相助，非常感谢阚光远、吴宇伦、尹立、杨刚大神在百忙之中回答了我一系列比较low的问题。

> 目前这个系列只做了第一部分 探究层的使用，绘制，关键性渲染还没有完成，渲染原理还在Google Developers上继续学习，有些翻译的粗糙的地方，说明我还没有懂，如果有大神在阅读的过程中发现了问题，请拍砖。

## 目录

- [探究层的使用](./1_layerbasic.md)
    - [demo](./demo)
- [绘制](./2_paint.md)
- [关键性渲染](./4_CRP.md)
- [渲染原理](./3_renderbasic.md)
