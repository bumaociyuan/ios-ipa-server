var fs = require('fs');
var express = require('express');
var mustache = require('mustache');
var strftime = require('strftime');
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

		var data = {};
		data.items = items;
		// console.log(data);
		var rendered = mustache.render(template, data);
		res.send(rendered);
	})
});

app.listen(port, function() {
	console.log("Server running at http://192.168.1.52:" + port);
	console.log('start')
});

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