自动生成自签名HTTPS服务器，局域网快速安装ipa

[For English README](./README-en.md)

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

#使用
* 使用[Ad-hoc](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/TestingYouriOSApp/TestingYouriOSApp.html)或者[企业级分发](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/DistributingEnterpriseProgramApps/DistributingEnterpriseProgramApps.html)打包ipa 放到ipas文件夹下
* 手机使用safari打开 https://ip:port/download 页面点击安装证书，按指示一直点击下一步和完成
* 点击ipa链接在线安装
* 强烈推荐使用静态IP，避免每次重新安装证书


#效果图
![screeshot](https://cloud.githubusercontent.com/assets/4977911/8761994/82e33fc0-2d9e-11e5-873e-dbf6027f26a5.png)

![0dd9988f67781c0af2df4456a0328a72](https://cloud.githubusercontent.com/assets/4977911/8762061/5423ef66-2da0-11e5-9bb5-35fb97c424fa.png)


#Lisence
[MIT](https://github.com/bumaociyuan/zxIpaServer/blob/master/LICENSE.md)
