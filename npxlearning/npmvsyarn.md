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

npm资源管理工具

```
npm install -g nrm
```

使用方法

```
nrm ls
* npm ---945ms
 yarn --- 948ms
cnpm --- 1046
taobao - 413ms
nj ------- Fetch Error
npmMirror 1794ms
edunpm - Fetch Error

//切换
$nrm use taobao
                  verb config Skipping project config: C:\Users\user/.npmrc.

Registry has been set to: https://registry.npm.taobao.org

// 增加源
$ nrm add <registry> <url> [home]

// 删除源
$ nrm del <registry>

$ nrm test
* npm ---945ms
 yarn --- 948ms
cnpm --- 1046
taobao - 413ms
nj ------- Fetch Error
npmMirror 1794ms
edunpm - Fetch Error
```

一般情况下，不使用VPN，淘宝源速度最快，但是可能会出现依赖安装不正确的情况，若使用公司私库，自然需要制定registry。

### NPM 更新版本不稳定

同一个项目，安装的时候无法保持一致性。由于package.json文件中版本号的特点，下面三个版本号在安装的时候代表不同的含义。

```
"5.0.3" // 表示安装制定的5.0.3版本
"~5.0.3" //表示安装5.0.x的最新版本
"^5.0.3" //表示安装5.x.x中最新的版本
```

所以常常会出现同一个项目，有的同时是OK的，有的同事会有安装的版本不一致出现bug。

同时，大多数npm库都严重依赖与其他npm库，这会导致嵌套依赖关系，并增加无法匹配相应版本的几率。虽然可以通过npm config set save-exact true命令关闭在版本号前面使用^的默认行为，但这个只会影响顶级依赖关系。由于每个以来的哭都有自己package.json文件，而在它们自己的依赖关系前面可能会有^符号，所以无法通过package.json文件为嵌套的内容提供保证。

文解决这个问题，npm提供了shrinkwrap命令。此命令将生成一个npm-shrinkwrap.json文件，为所有库和所有嵌套依赖的库记录确切的版本。

然而，即使存在npm-shrinkwrap.json这个文件，npm也只会锁定库的版本，而不是库的内容。即使npm现在也能组织用户多次重复发布库的同一版本，但是npm管理员仍然具有强制更新某些库的权力；

所以实际开发中，第三方依赖包版本根据需求写死或者限制版本范围，预防换包导致的兼容bug。测试开发是，如何确保更新的包是最新版本？

这里先得介绍一下 package-lock.json

package-lock.json诞生的目的就是为了防止出现我们上述的情况。同一个package.json却产生了不同的运行结果。package-lock.json在npm5时添加进来，所以如果你使用5以上的版本，除非你手动禁用掉它。

所以从此以后npm会根据package-lock.json里的内容来处理和安装依赖而不是根据package.json。因为package-lock.json个每个以来表明了版本，获取地址和哈希值，是的每次安装都会出现相同的结果。不管你在什么机器上面或什么时候安装的。

#### 官方定义

> package-lock.json is automatically generated for any operations where npm modifies either the node_modules tree, or package.json. It describes the exact tree that was generated, such that subsequent install are able to generate identical trees, regardless of intermediate dependency update. This file is intended to committed into source repositories, and serves various purposes.

因此，解决方案

```

$ rm -rf node_modules

$ rm package-lock.json

$ npm i
// npm-check 检查更新

$ npm install -g npm-check

$ npm-check

$ npm-check -u

? Choose which packages to update. (Press <space> to select)

Updatge package.json to match version installed
> chalk ^1.1.3    >   2.4.2    https://github.com/chalk/chalk#readme
> cheerio ^0.22.0  >  0.22.0    https://github.com/cheeriojs/cheerio#readme

  Space to select. Enter to start upgrading. control-C to cancel

// npm-upgrade更新
$ npm install -g npm-upgrade

$ npm-upgrade

// 更新全局包
$ npm update <name> -g

// 更新生产环境依赖包
$ npm update <name> --save

// 更新开发环境依赖包
$ npm update <name> --save-dev

// 升级package-lock.json里面的库包
$ npm install XXX@x.x.x

```
