/*!
 * grunt-Mustatic
 * https://github.com/dbushell/dbushell-grunt-Mustatic
 *
 * Copyright (c) David Bushell
 * Licensed under The MIT License (MIT)
 */

var fs = require('fs'),
    path = require('path'),
    hogan = require('hogan.js'),
    mustatic = require('./lib/mustatic.js');

module.exports = function(grunt)
{
    'use strict';

    grunt.registerMultiTask('mustatic', 'Render static HTML templates with Mustache', function()
    {

        var options = this.options({
            src  : 'templates',
            dest : 'build',
            ext  : 'html',
            navStates : false,
            relLinks  : true
        });

        // match templates based on file name
        var matcher = new RegExp('\\' + '.' + options.ext + '$');

        // load base template and data
        var basePath = options.src + '/base.' + options.ext,
            baseData = basePath.replace(matcher, '.json'),
            baseSrc  = grunt.file.read(basePath),
            base     = hogan.compile(baseSrc);

        // set-up globals
        var globals = mustatic.merge({
                'assets': 'assets/'
            },
            this.data.globals || { });

        // merge globals with base data
        if (grunt.file.exists(baseData)) {
            globals = mustatic.merge(globals, JSON.parse(grunt.file.read(baseData)));
        }

        // store locals for each template using name as key
        var data = { };

        // compile templates from a given directory
        var compile = function(path, partials)
        {
            var templates = { };

            grunt.file.recurse(path, function (absPath, rootDir, subDir, filename)
            {
                // ignore non-template files
                if (!filename.match(matcher)) {
                    return;
                }

                // read template source and data
                var relPath  = absPath.substr(rootDir.length + 1),
                    tmpData  = absPath.replace(matcher, '.json'),
                    tmpSrc   = grunt.file.read(absPath),

                    // template name based on path (e.g. "index", "guide/index", etc)
                    name     = relPath.replace(matcher, ''),

                    // set-up template specific locals
                    locals   = mustatic.merge({}, globals);

                // add template URL to locals
                locals.url = name + '.html';

                // load template data and merge into locals
                if (grunt.file.exists(tmpData)) {
                    locals = mustatic.merge(locals, JSON.parse(grunt.file.read(tmpData)));
                }

                // store locals
                data[name] = locals;

                templates[name] = hogan.compile(tmpSrc);
            });

            return templates;
        };

        var partials = compile(options.src + '/partials'),
            pages    = compile(options.src + '/pages', partials);

        var pre  = [ ],
            post = [ ];

        if (options.navStates) {
            pre.push(mustatic.preNavStates);
        }

        if (options.relLinks) {
            post.push(mustatic.postRelLinks);
        }

        // render each page template
        mustatic.each(pages, function(page, name)
        {
            // retrieve locals
            var locals = data[name];

            // pre-render callbacks
            pre.forEach(function(func) {
                func.call(null, page, name, locals);
            });

            // render HTML
            partials.content = page;
            var render = base.render(locals, partials);

            // post-render callbacks
            post.forEach(function(func) {
                render = func.call(null, render, name, locals);
            });

            // write template to build directory
            grunt.file.write(options.dest + '/' + name + '.html', render);
        });

    });

};
