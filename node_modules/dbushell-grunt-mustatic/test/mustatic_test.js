/*!
 * grunt-Mustatic
 * https://github.com/dbushell/dbushell-grunt-Mustatic
 *
 * Copyright (c) David Bushell
 * Licensed under The MIT License (MIT)
 */

var fs = require('fs');

exports.test1 = function(test)
{
    test.expect(4);

    var files = [
        'test/build',
        'test/build/index.html',
        'test/build/guide',
        'test/build/guide/index.html'
    ];

    files.forEach(function(path) {
        test.ok(fs.existsSync(path), 'build path should exist: "' + path + '"');
    });

    test.done();
};

exports.group1 = {

    setUp: function(callback)
    {
        try {
            this.src = fs.readFileSync('test/build/index.html');
            this.src = this.src.toString();
        }
        catch(e) { this.src = undefined; }

        try {
            this.data = fs.readFileSync('test/templates/base.json');
            this.data = JSON.parse(this.data);
        }
        catch (e) { this.data = undefined; }

        callback();
    },

    test1: function(test)
    {
        test.expect(4);

        test.equal(typeof this.src, 'string', 'index.html should be readable');
        test.equal(typeof this.data, 'object', 'base.json should be readable');

        if (!this.src || !this.data) {
            test.done();
            return;
        }

        var description = /<meta name="description" content="(.*?)">/.exec(this.src);

        test.notEqual(description, null, 'index.html <meta name="description"> RegExp should match');
        test.equal(description[1], this.data.description, 'index.html <meta name="description"> should equal: "' + this.data.description + '"');

        test.done();
    }
};

exports.group2 = {

    setUp: function(callback)
    {
        try {
            this.src = fs.readFileSync('test/build/index.html');
            this.src = this.src.toString();
        }
        catch(e) { this.src = undefined; }

        try {
            this.data = fs.readFileSync('test/templates/pages/index.json');
            this.data = JSON.parse(this.data);
        }
        catch (e) { this.data = undefined; }

        callback();
    },

    test1: function(test)
    {
        test.expect(8);

        test.equal(typeof this.src, 'string', 'index.html should be readable');
        test.equal(typeof this.data, 'object', 'index.json should be readable');

        if (!this.src || !this.data) {
            test.done();
            return;
        }

        var charset = /<meta charset="(.*?)">/.exec(this.src),
            title = /<title>(.*?)<\/title>/.exec(this.src),
            body = /<body class="(.*?)">/.exec(this.src);

        test.notEqual(charset, null, 'index.html <meta charset> RegExp should match');
        test.equal(charset[1], 'utf-8', 'index.html <meta charset> should equal: "utf-8"');

        test.notEqual(title, null, 'index.html <title> RegExp should match');
        test.equal(title[1], this.data.title, 'index.html <title> should equal: "' + this.data.title + '"');

        test.notEqual(body, null, 'index.html <body> RegExp should match');
        test.equal(body[1], 'body--index', 'index.html <body> class attribute should equal: "body--index"');

        test.done();
    }
};
