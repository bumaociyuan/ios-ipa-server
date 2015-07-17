/*!
 * grunt-Mustatic
 * https://github.com/dbushell/dbushell-grunt-Mustatic
 *
 * Copyright (c) David Bushell
 * Licensed under The MIT License (MIT)
 */

'use strict';

var URI = require('URIjs');

function each(obj, func)
{
    var i, length, keys = Object.keys(obj);
    for (i = 0, length = keys.length; i < length; i++) {
        func.call(null, obj[keys[i]], keys[i]);
    }
}

function merge(obj, extended)
{
    each(extended, function(v, k) {
        obj[k] = v;
    });
    return obj;
}

module.exports.each = each;
module.exports.merge = merge;

/**
 * Navigation States
 * toggle navigation item class based on current template
 */
module.exports.preNavStates = function(page, name, locals)
{
    if (locals.nav) {
        each(locals.nav.nav__list.nav__item, function(item) {
            item.class = item.url === locals.url ? "nav__item--active" : "";
        });
    }
};

/**
 * Relative Links
 * fix relative URLs based on template depth (for `href` and `src` attributes)
 */
module.exports.postRelLinks = function(render, name, locals)
{
    // prefix for relative URLs
    // var depth = (name.match(/\//g)||[]).length;
    // if (!depth) {
    //     return render;
    // }

    // find all relative URLs
    var head, tail, match, offset, found = [],
        regex = /(href|src)="(.*?)"/ig;

    while((match = regex.exec(render)) !== null) {
        // ignore document fragment references
        if (match[2][0] === '#') {
            continue;
        }
        // ignore external URLs (starting with schema)
        if (! /^([a-z]+):/.test(match[2])) {
            found.push(match);
        }
    }

    var path = new URI('/' + locals.url);

    // replace relative URLs (in reverse to avoid offset changes)
    found.reverse().forEach(function(match, i)
    {
        // separate render before and after URL
        offset = match.index + match[1].length + 2;
        head = render.substring(0, offset);
        tail = render.substring(offset + match[2].length);

        var newPath = new URI('/' + match[2]).relativeTo(path).toString();

        // stitch render back together with new URL
        render = head + (newPath || './' + path.filename()) + tail;
    });

    return render;
};
