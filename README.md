自动生成自签名HTTPS服务器，快速安装ipa

[README For English](./README-en.md)

# 支持
* OS X
* Ubuntu
* 其他平台未测试

# 需要
* [nodejs](https://nodejs.org/)

#安装

```
$ npm install -g ios-ipa-server
```

# 用法

```
Usage: ios-ipa-server [option] [dir]

Options:

-h, --help                output usage information
-V, --version             output the version number
-p, --port <port-number>  set port for server (defaults is 1234)
```
```
$ cd /path/of/ipas
$ ios-ipa-server

# or

$ ios-ipa-server /path/of/ipas


# open https://ip:port/download on your iphone

```

# 使用
* 使用[Ad-hoc](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/TestingYouriOSApp/TestingYouriOSApp.html)或者[企业级分发](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/DistributingEnterpriseProgramApps/DistributingEnterpriseProgramApps.html)打包ipa 放到ipas文件夹下
* 手机使用safari打开 https://ip:port/download 页面点击安装证书，按指示一直点击下一步和完成
* 点击ipa链接在线安装
* 强烈推荐使用静态IP，避免每次重新安装证书


# 效果图
![screeshot](screeshot.png)


# 开发

```
# 下载源码
git clone git@github.com:bumaociyuan/ios-ipa-server.git

# 安装依赖包
cd ios-ipa-server
npm install 

# 建立link 方便调试
npm link

# 运行
cd /path/of/ipa
ios-ipa-server
```
#Lisence
[MIT](https://github.com/bumaociyuan/zxIpaServer/blob/master/LICENSE.md)
