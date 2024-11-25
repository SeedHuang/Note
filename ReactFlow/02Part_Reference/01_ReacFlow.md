# ReactFlow

[查看源码](https://github.com/xyflow/xyflow/blob/main/packages/react/src/container/ReactFlow/index.tsx/#L47)

`<ReactFlow/>`是React Flow应用程序的核心组件。他渲染节点和边线，处理用户交付，以及当他是个[uncontrolled flow](https://reactflow.dev/learn/advanced-use/uncontrolled-flow)时管理他自己的状态

```java
import { ReactFlow } from '@xyflow/react'
 
export default function Flow() {
  return <ReactFlow
    nodes={...}
    edges={...}
    onNodesChange={...}
    ...
  />
}
```

这个组件需要很多不同的道具，其中大多数是可选的。我们试图将它们分组记录，以帮助您找到方向。

## Common props

t这些是您在使用React Flow时最常用的属性。如果你使用的是带有自定义节点的受控流(Controlled Flow)，你可能会使用几乎所有这些！


| Props           | 数据类型                                         | 描述                                                                                                                                     |
| --------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `nodes`         | Node[]                                           | 受控流中渲染的一组节点                                                                                                                   |
| `edges`         | Edge[]                                           | 受控流中渲染的一组边线                                                                                                                   |
| `defaultNodes`  | Node[]                                           | 在未受控的流中渲染的初始化节点                                                                                                           |
| `defaultEdges`  | Edge[]                                           | 在未受控的流中渲染的初始化边线                                                                                                           |
| `onNodesChange` | (changes: NodesChange[]) => void                 | 使用此事件处理程序向受控流添加交互性。它在节点拖动(node drag)、选择(select)和移动时调用(move)。                                          |
| `onEdgesChange` | (changes: EdgeChange[]) => void                  | 使用此事件处理程序向受控流添加交互性。它被边线选择和删除调用。                                                                           |
| `onConnect`     | (connection: Connection) => void                 | 当连接线完成并且用户连接了两个节点时，此事件将与新连接一起触发。您可以使用addEdge工具方法将连接转换为完整的边线。                        |
| `nodeTypes`     | `Record<String, React.ComponentType<NodeProps>>` | 如果你想在流中使用自定义节点，你需要让React flow知道它们。当渲染一个新节点时，React Flow会在这个对象中查找该节点的类型并渲染相应的组件。 |
| `edgeTypes`     |                                                  |                                                                                                                                          |
|                 |                                                  |                                                                                                                                          |
|                 |                                                  |                                                                                                                                          |
|                 |                                                  |                                                                                                                                          |
|                 |                                                  |                                                                                                                                          |
