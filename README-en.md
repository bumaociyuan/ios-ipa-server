Install IPA with HTTPS, and auto generate certificates.

[中文介绍](./README.md)

# Support Platform
* OS X
* Ubuntu
* Not test for other platform

# Require
* [nodejs](https://nodejs.org/)

# Installation
```
$ npm install -g ios-ipa-server
```

# Usage
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

* Use [Ad-hoc](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/TestingYouriOSApp/TestingYouriOSApp.html) or [Enterprise Distributing](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/DistributingEnterpriseProgramApps/DistributingEnterpriseProgramApps.html)
* Open https://ip:port/download, then click Certificate to install.
* Click ipa link to install app.
* Highly recommond use static ip address, avoid reinstall cer every time.

# Screenshots
![screeshot](screeshot.png)


#Lisence
[MIT](https://github.com/bumaociyuan/zxIpaServer/blob/master/LICENSE.md)
