var fs = require('fs');
var https = require('https');
var path = require('path');

var express = require('express');
var mustache = require('mustache');
var strftime = require('strftime');
var underscore = require('underscore');

var options = {
	key: fs.readFileSync('cer/mycert1.key', 'utf8'),
	cert: fs.readFileSync('cer/mycert1.cer', 'utf8')
};

var ipasDir = 'ipas';
var port = 1234;
var ipAddress = underscore
	.chain(require('os').networkInterfaces())
	.values()
	.flatten()
	.find(function(iface) {
		return iface.family === 'IPv4' && iface.internal === false;
	})
	.value()
	.address;

console.log('https://' + ipAddress + ':' + port + '/download');

var app = express();
app.use('/', express.static(__dirname + '/' + ipasDir));
app.use('/qrcode', express.static(__dirname + '/qrcode'));


app.use('/download', function(req, res, next) {

	fs.readFile('download.html', function(err, data) {
		if (err) throw err;
		var template = data.toString();

		var ipas = ipasInLocation(ipasDir);

		var items = [];
		for (var i = ipas.length - 1; i >= 0; i--) {
			items.push(itemWithEnv(ipas[i]));
		};
		items = items.sort(function(a, b) {
			return a.time < b.time;
		})
		var info = {};
		info.ip = ipAddress;
		info.port = port;
		info.items = items;
		var rendered = mustache.render(template, info);
		res.send(rendered);
	})
});


app.get('/plist/:file', function(req, res) {
	fs.readFile('template.plist', function(err, data) {
		if (err) throw err;
		var template = data.toString();

		var rendered = mustache.render(template, {
			name: req.params.file,
			ip: ipAddress,
			port: port,
		});

		res.set('Content-Type', 'text/plain; charset=utf-8');
		res.send(rendered);
	})
});

https.createServer(options, app).listen(port);

function itemWithEnv(env) {
	var stat = fs.statSync(ipasDir + '/' + env + '.ipa');
	var time = new Date(stat.mtime);
	var timeString = strftime('%F %H:%M', time);
	return {
		name: env,
		description: '   更新: ' + timeString,
		time: time,
		ip: ipAddress,
		port: port,
	}
}

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