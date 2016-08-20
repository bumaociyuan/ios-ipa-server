#!/usr/bin/env node

var fs = require('fs-extra');
var https = require('https');
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

var os = require('os');
require('shelljs/global');

var ipAddress = underscore
  .chain(require('os').networkInterfaces())
  .values()
  .flatten()
  .find(function(iface) {
    return iface.family === 'IPv4' && iface.internal === false;
  })
  .value()
  .address;


var globalCerFolder = os.homedir() + '/.ios-ipa-server/' + ipAddress;
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
  .parse(process.argv);

var port = program.port || 1234;

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

  console.log('https://' + ipAddress + ':' + port + '/download');
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

  var options = {
    key: key,
    cert: cert
  };

  var app = express();
  app.use('/public', express.static(path.join(__dirname, '..', 'public')));
  app.use('/cer', express.static(globalCerFolder));

  app.get('/ipa/:ipa', function(req, res) {
    var filename = ipasDir + '/' + req.params.ipa;
    // console.log(filename);

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
      if (err) throw err;
      var template = data.toString();

      var ipas = ipasInLocation(ipasDir);

      var items = [];
      for (var i = ipas.length - 1; i >= 0; i--) {
        items.push(itemInfoWithName(ipas[i], ipasDir));
      };

      items = items.sort(function(a, b) {
        var result = b.time.getTime() - a.time.getTime();
        // if (result > 0) {result = 1} else if (result < 0) { result = -1 };

        return result;
      });

      var info = {};
      info.ip = ipAddress;
      info.port = port;
      info.items = items;
      var rendered = mustache.render(template, info);
      res.send(rendered);
    })
  });


  app.get('/plist/:file', function(req, res) {
    fs.readFile(path.join(__dirname, '..', 'templates') + '/template.plist', function(err, data) {
      if (err) throw err;
      var template = data.toString();

      var rendered = mustache.render(template, {
        name: req.params.file,
        ip: ipAddress,
        port: port,
      });

      res.set('Content-Type', 'text/plain; charset=utf-8');
      // res.set('MIME-Type', 'application/octet-stream');
      res.send(rendered);
    })
  });

  https.createServer(options, app).listen(port);

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
  ipaEntries.forEach(function(ipaEntry) {
    if (ipaEntry.entryName.indexOf('AppIcon60x60@3x.png') != -1) {
      var buffer = new Buffer(ipaEntry.getData());
      if (buffer.length) {
        fs.writeFileSync(tmpIn, buffer);
        var result = exec(path.join(__dirname, '..', exeName +' -s _tmp ') + ' ' + tmpIn).output;
        iconString = 'data:image/png;base64,' + base64_encode(tmpOut);
      }
    }
  });
  fs.removeSync(tmpIn);
  fs.removeSync(tmpOut);
  return {
    name: name,
    description: '   更新: ' + timeString,
    time: time,
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
