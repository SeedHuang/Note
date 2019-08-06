ssh会把你每个你访问过计算机的公钥(public key)都记录在~/.ssh/known_hosts。当下次访问相同计算机时，OpenSSH会核对公钥。如果公钥不同，OpenSSH会发出警告， 避免你受到DNS Hijack之类的攻击。我在上面列出的情况，就是这种情况。 

原因：一台主机上有多个Linux系统，会经常切换，那么这些系统使用同一ip，登录过一次后就会把ssh信息记录在本地的~/.ssh/known_hsots文件中，切换该系统后再用ssh访问这台主机就会出现冲突警告，需要手动删除修改known_hsots里面的内容。 

有以下两个解决方案： 
1. 手动删除修改known_hsots里面的内容； 
2. 修改配置文件“~/.ssh/config”，加上这两行，重启服务器。 
   StrictHostKeyChecking no 
   UserKnownHostsFile /dev/null 

优缺点： 
1. 需要每次手动删除文件内容，一些自动化脚本的无法运行（在SSH登陆时失败），但是安全性高； 
2. SSH登陆时会忽略known_hsots的访问，但是安全性低；
