Create a HTTPS Server to install ipa locally

[self signed certificates in iOS](http://bumaociyuan.github.io/ios/2015/07/17/self-signed-certificates-in-ios.html)

#Require
* [nodejs](https://nodejs.org/)

#使用
* 打包ipa使用[Ad-hoc](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/TestingYouriOSApp/TestingYouriOSApp.html)或者[企业级分发](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/DistributingEnterpriseProgramApps/DistributingEnterpriseProgramApps.html) 放到ipas文件夹下

##生成自签名证书
```
sh generate-certificate.sh
#input any password
```

##启动服务
```
node index.js
```

##效果图
![screeshot](https://cloud.githubusercontent.com/assets/4977911/8761994/82e33fc0-2d9e-11e5-873e-dbf6027f26a5.png)

![0dd9988f67781c0af2df4456a0328a72](https://cloud.githubusercontent.com/assets/4977911/8762061/5423ef66-2da0-11e5-9bb5-35fb97c424fa.png)



