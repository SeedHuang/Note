# Headless Chrome

> 现在已经类似的测试框架，如[phantomjs](http://phantomjs.org/),但是Headless Chrome比phantomjs更强

- 首先Headless Chrome是59之后的功能，如果你想使用该功能的话，升级或安装你的chrome
```
brew install Caskroom/versions/google-chrome-canary  
```

安装完之后就是要设置他的alias，谷歌官网上有很好的例子的设置alias

```
# 打开.bash_profile文件
vim ~/.bash_profile
# 添加chrome alias
alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
# 添加chrome-canary alias
alias chrome-canary="/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary"
# 添加chromius alias
alias chromium="/Applications/Chromium.app/Contents/MacOS/Chromium"
```

接下来就可以进行测试
```
# 会在当前的工作目录生成一张截图，比如桌面文件夹
chrome-canary --headless --disable-gpu --screenshot https://www.baidu.com

# 打开远程调试模式
chrome-canary --headless --disable-gpu --remote-debugging-port=9222 https://www.baidu.com
```

更强大的功能，使用命令行绝对不是目的这样也搞不定plantomJS, 接下主要讲加一下和nodejs结合，我们先截个屏。
- [lesson 1 Screen Shot](./l1_screenshot);
