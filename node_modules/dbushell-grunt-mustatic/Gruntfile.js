/*!
 * grunt-Mustatic
 * https://github.com/dbushell/dbushell-grunt-Mustatic
 *
 * Copyright (c) David Bushell
 * Licensed under The MIT License (MIT)
 */

module.exports = function(grunt)
{
    'use strict';

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.initConfig({

        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/**/*.js',
                'test/**/*.json'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        clean: {
            tests: ['test/build/**/*.html']
        },

        nodeunit: {
            tests: ['test/*_test.js']
        },

        mustatic: {
            options: {
                src  : 'test/templates',
                dest : 'test/build',
                ext  : 'mustache',
                navStates : true
            },
            build: {
                globals: {
                    lang    : 'en',
                    charset : 'utf-8',
                    assets  : 'assets/'
                }
            }
        }

    });

    grunt.registerTask('test', ['jshint', 'clean', 'mustatic', 'nodeunit']);

    grunt.registerTask('default', ['test']);

};
