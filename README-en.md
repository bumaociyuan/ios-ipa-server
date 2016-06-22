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

## Start Server
```
$ cd /path/of/ipa
$ ios-ipa-server

# or 

$ ios-ipa-server /path/of/ipa


# open https://ip:port/download on your iphone 
```

### About `ipa` archive
* [Ad-hoc](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/TestingYouriOSApp/TestingYouriOSApp.html)
* [Enterprise Distributing](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/DistributingEnterpriseProgramApps/DistributingEnterpriseProgramApps.html)
* For normal developer you can use the [shenzhen](https://github.com/nomad/shenzhen) to build the `ipa`.
* Highly recommond use static ip address, avoid reinstall cer every time.

### Install App
* Open `https://ip:port/download` page.
* The first time webpage will alert `blabla`, plz click confirm, and click the Certificate's installation link, follow the hint press next and input password.
* Click the `ipa` link to install ota.

# Screenshots
![screeshot];(screeshot.png)

# Develop

```
# Download source code
git clone git@github.com:bumaociyuan/ios-ipa-server.git

# Install modules
cd ios-ipa-server
npm install 

# Make link for debug
npm link

# Run
cd /path/of/ipa
ios-ipa-server
```

#Lisence
[MIT](https://github.com/bumaociyuan/zxIpaServer/blob/master/LICENSE.md)
