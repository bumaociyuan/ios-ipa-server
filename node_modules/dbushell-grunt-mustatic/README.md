grunt-Mustatic
==============

> Grunt task for rendering static HTML templates with [Mustache](http://mustache.github.io/)

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install dbushell-grunt-mustatic --save
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('dbushell-grunt-mustatic');
```

## The Mustatic Task

### Configuration

Example task configuration:

```js
grunt.initConfig({
    mustatic: {
        options: {
            src: 'templates',
            dest: 'build'
        },
        prod: {
            globals: {
                lang: 'en',
                charset: 'utf-8'
            }
        }
    }
});
```

### Options

#### options.src

Type: `String` default: `"templates"`

This is the source directory of your mustache templates and JSON data:

```
templates/
  +-- base.html
  +-- base.json
  |
  +-- pages/
  |     +-- index.html
  |     +-- index.json
  |
  +-- partials/
        +-- header.html
        +-- footer.html
```

* `base.html` is your base template
* `base.json` is your global data not defined in the task configuration
* `pages/` contains templates to be rendered (with optional template specific data)
* `partials/` contains partial templates to be included within pages

A minimal base template would look like this:

```html
<!DOCTYPE html>
<html lang="{{lang}}">
<head>
    <meta charset="{{charset}}">
    <title>{{title}}</title>
</head>
<body>
{{>content}}
</body>
</html>
```

Use `{{>content}}` in `base.html` to include the page.
The `{{title}}` variable can be defined in `base.json` and overridden in `index.json`, for example.
Any nested directory structure within `pages/` will be maintained when the static site is built (see: [`options.dest`](#optionsdest)).
Partials can be organised and referenced by directory, e.g. `{{>header/nav}}` would include `partials/header/nav.html`.

See the [**Mustache documentation**](http://mustache.github.io/mustache.5.html) for templating help.

#### options.dest

Type: `String` default: `"build"`

This is the build directory where rendered HTML files will be saved.

#### options.ext

Type: `String` default: `"html"`

This is the file extension used for your mustache templates.

#### globals

Type: `Object` default: `{ }`

This is global template data in which `base.json` will be merged. This data is environment-specific.

### Experimental Options

grunt-Mustatic has been designed to allow pre and post render functions to aid static website building.

#### options.relLinks

Type: `Boolean` default: `true`

This option will convert all URLs in `href` and `src` attributes relative to the template path. For example, if both pages include this `{{>nav}}` partial:

```html
<nav>
    <a href="index.html">Home</a>
    <a href="section/content.html">Content</a>
</nav>
```

The URLs in `section/content.html` will be converted to:

```html
<nav>
    <a href="../index.html">Home</a>
    <a href="./content.html">Content</a>
</nav>
```

For this option to work all URLs should be written relative to the root of the template directory.

## Credits

Created by: [David Bushell](http://dbushell.com) | [@dbushell](http://twitter.com/dbushell) (based on: [grunt-mustache-html](https://github.com/haio/grunt-mustache-html))

Using: [Hogan.js](https://github.com/twitter/hogan.js) to compile Mustache templates

Copyright © David Bushell | MIT license
