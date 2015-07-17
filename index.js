var fs = require('fs');
var express = require('express');
var mustache = require('mustache');
var strftime = require('strftime');
var https = require('https');

var options = {
	key: fs.readFileSync('cer/mycert1.key', 'utf8'),
	cert: fs.readFileSync('cer/mycert1.cer', 'utf8')
};

var app = express();
var port = 1234;

app.use('/', express.static(__dirname + '/'));

app.use('/download', function(req, res, next) {
	fs.readFile('download.html', function(err, data) {
		if (err) throw err;
		var template = data.toString();

		var items = [];
		var ipas = ['dev', 'oem1', 'cn', 'com', 'oem2', 'faceo2o'];
		for (var i = ipas.length - 1; i >= 0; i--) {
			items.push(itemWithEnv(ipas[i]));
		};

		items = items.sort(function(a, b) {
			return a.time < b.time;
		})

		var info = {};
		info.items = items;

		var rendered = mustache.render(template, info);
		res.send(rendered);
	})
});


app.get('/plist/:file', function(req, res) {
	fs.readFile('template.plist', function(err, data) {
		if (err) throw err;
		var template = data.toString();

		var rendered = mustache.render(template, {name:req.params.file});

		res.set('Content-Type', 'text/plain; charset=utf-8');
		res.send(rendered);
		res.end();
	})
});


https.createServer(options, app).listen(port);


function itemWithEnv(env) {
	var stat = fs.statSync(env + '.ipa');
	var time = new Date(stat.mtime);
	var timeString = strftime('%F %H:%M', time);
	return {
		name: env,
		description: '   更新: ' + timeString,
		time: time
	}
}