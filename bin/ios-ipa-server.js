#!/usr/bin/env node

var fs = require('fs-extra');
var https = require('https');
var http = require('http');
var path = require('path');
var exit = process.exit;
var pkg = require('../package.json');
var version = pkg.version;

var program = require('commander');
var express = require('express');
var mustache = require('mustache');
var strftime = require('strftime');
var underscore = require('underscore');
var AdmZip = require('adm-zip');
var osHomedir = require('os-homedir');
var base64 = require('base64-url');
var qrcode = require('qrcode-terminal');


var os = require('os');
require('shelljs/global');

/**
 * Main program.
 */
process.exit = exit

// CLI

before(program, 'outputHelp', function() {
  this.allowUnknownOption();
});

program
  .version(version)
  .usage('[option] [dir]')
  .option('-p, --port <port-number>', 'set port for server (defaults is 1234)')
  .option('-i, --ip <ip-address>', 'set ip address for server (defaults is automatic getting by program)')
  .option('-n, --nossl', 'disable SSL for ios-ipa-server(default is enabled)')
  .option('-d, --domain <domain>', 'domain for ios-ipa-server')

  .parse(process.argv);

var ipAddress = program.ip || underscore
  .chain(require('os').networkInterfaces())
  .values()
  .flatten()
  .find(function(iface) {
    return iface.family === 'IPv4' && iface.internal === false;
  })
  .value()
  .address;



var globalCerFolder = osHomedir() + '/.ios-ipa-server/' + ipAddress;
var port = program.port || 1234;
var port2 = port + 1;
var domain = program.domain
var disabledSSL = program.nossl
if (!exit.exited) {
  main();
}

/**
 * Install a before function; AOP.
 */

function before(obj, method, fn) {
  var old = obj[method];

  obj[method] = function() {
    fn.call(this);
    old.apply(this, arguments);
  };
}

function main() {
  var downloadURL = 'https://' + ipAddress + ':' + port + '/download';
  var cerURL = 'http://' + ipAddress + ':' + port2 + '/cer';
  qrcode.generate(cerURL);
  console.log('Install CA certification on iOS 11 ' + cerURL);
  console.log('\n');
  qrcode.generate(downloadURL);
  console.log('Open download page ' + downloadURL);
  var destinationPath = program.args.shift() || '.';
  var ipasDir = destinationPath;
  
  var key;
  var cert;

  try {
    key = fs.readFileSync(globalCerFolder + '/mycert1.key', 'utf8');
    cert = fs.readFileSync(globalCerFolder + '/mycert1.cer', 'utf8');
  } catch (e) {
    var result = exec('sh  ' + path.join(__dirname, '..', 'generate-certificate.sh') + ' ' + ipAddress).output;
    key = fs.readFileSync(globalCerFolder + '/mycert1.key', 'utf8');
    cert = fs.readFileSync(globalCerFolder + '/mycert1.cer', 'utf8');
  }
  console.log("disable ssl is =" + disabledSSL)
  var options = disabledSSL ? {} : {
    key: key,
    cert: cert
  };

  var app = express();
  app.use('/public', express.static(path.join(__dirname, '..', 'public')));
  app.use('/cer', express.static(globalCerFolder));

  var cerApp = express();
  cerApp.get('/cer', function(req, res) {
    fs.readFile(globalCerFolder + '/myCA.cer', function(err, data) {
      if (err)
        throw err;
      res.setHeader('Content-disposition', 'attachment; filename=myCA.cer');
      res.setHeader('Content-type', 'application/pkix-cert');
      res.send(data);
    });
  });
  cerApp.listen(port2);

  app.get('/ipa/:ipa', function(req, res) {
    var encodedName = req.params.ipa.replace('.ipa', '');
    var ipa = base64.decode(encodedName);
    var filename = ipasDir + '/' + ipa + '.ipa';

    // This line opens the file as a readable stream
    var readStream = fs.createReadStream(filename);

    // This will wait until we know the readable stream is actually valid before piping
    readStream.on('open', function() {
      // This just pipes the read stream to the response object (which goes to the client)
      readStream.pipe(res);
    });

    // This catches any errors that happen while creating the readable stream (usually invalid names)
    readStream.on('error', function(err) {
      res.end(err);
    });
  });

  app.get(['/', '/download'], function(req, res, next) {

    fs.readFile(path.join(__dirname, '..', 'templates') + '/download.html', function(err, data) {
      if (err)
        throw err;
      var template = data.toString();

      var ipas = ipasInLocation(ipasDir);

      var items = [];
      for (var i = ipas.length - 1; i >= 0; i--) {
        items.push(itemInfoWithName(ipas[i], ipasDir));
      }

      items = items.sort(function(a, b) {
        var result = b.time.getTime() - a.time.getTime();
        return result;
      });

      var info = {};
      info.ip = ipAddress;
      info.port = port;
      info.items = items;
      console.log(domain)
      info.url = domain ? domain : (ipAddress + ":" + port);
      var rendered = mustache.render(template, info);
      res.send(rendered);
    })
  });


  app.get('/plist/:file', function(req, res) {

    fs.readFile(path.join(__dirname, '..', 'templates') + '/template.plist', function(err, data) {
      if (err)
        throw err;
      var template = data.toString();

      var encodedName = req.params.file;
      var name = base64.decode(encodedName)
      var rendered = mustache.render(template, {
        encodedName: encodedName,
        name: name,
        ip: ipAddress,
        port: port,
        url: domain ? domain : (ipAddress + ":" + port)
      });

      res.set('Content-Type', 'text/plain; charset=utf-8');
      res.send(rendered);
    })
  });
  if (disabledSSL) {
    http.createServer(app).listen(port);
  }
  else {
    https.createServer(options, app).listen(port);
  }

}

function itemInfoWithName(name, ipasDir) {
  var location = ipasDir + '/' + name + '.ipa';
  var stat = fs.statSync(location);
  var time = new Date(stat.mtime);
  var timeString = strftime('%F %H:%M', time);

  // get ipa icon only works on macos
  var iconString = '';
  var exeName = '';
  if (process.platform == 'darwin') {
    exeName = 'pngdefry-osx';
  } else {
    exeName = 'pngdefry-linux';
  }
  var ipa = new AdmZip(location);
  var ipaEntries = ipa.getEntries();
  var tmpIn = ipasDir + '/icon.png';
  var tmpOut = ipasDir + '/icon_tmp.png';
  try {
    ipaEntries.forEach(function(ipaEntry) {
      if (ipaEntry.entryName.indexOf('AppIcon60x60@3x.png') != -1) {
        var buffer = new Buffer(ipaEntry.getData());
        if (buffer.length) {
          fs.writeFileSync(tmpIn, buffer);
          var result = exec(path.join(__dirname, '..', exeName + ' -s _tmp ') + ' ' + tmpIn).output;
          iconString = 'data:image/png;base64,' + base64_encode(tmpOut);
        }
      }
    });
  } catch (e) {
    if (e) {
      var imageBase64 = fs.readFileSync(tmpIn).toString("base64");
      iconString = 'data:image/png;base64,' + imageBase64;
    }
  }
  fs.removeSync(tmpIn);
  fs.removeSync(tmpOut);
  return {
    encodedName: base64.encode(name),
    name: name,
    time: time,
    timeString: timeString,
    iconString: iconString,
    ip: ipAddress,
    port: port,
  }
}

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}
/**
 *
 */

function ipasInLocation(location) {
  var result = [];
  var files = fs.readdirSync(location);
  for (var i in files) {
    if (path.extname(files[i]) === ".ipa") {
      result.push(path.basename(files[i], '.ipa'));
    }
  }
  return result;
}
