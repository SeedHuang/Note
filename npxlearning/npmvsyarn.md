## NPM INSTALL 安装依赖慢
有些依赖包源书与国外，在国内下载第三方包的速度极慢。

解决方案：
1. 使用淘宝NPM镜像定制的cnpm（gzip压缩支持）命令行功酒代替默认的npm
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

使用方法
```
cnpm install [name]
```