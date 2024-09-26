n的安装有问题

curl: (28) Failed to connect to nodejs.org port 443 after 151027 ms: Couldn't connect to server

不是网络的问题，用这个办法解决

```
// 设置环境变量为nodejs镜像站点，加速nodejs下载
export N_NODE_MIRROR=https://npmmirror.com/mirrors/node

// 执行zshrc文件，加载新环境变量设置
source ~/.zshrc

// -E继承当前环境变量 lts安装nodejs最新长期支持版本
sudo -E n lts

作者：土豆思思
链接：https://juejin.cn/post/7412685771503157299
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

如果要安装新的nodejs，只能用`sudo -E n xxxxxxx`版本
