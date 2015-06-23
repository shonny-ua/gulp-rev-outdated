'use strict';
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var through = require('through2');
var path = require('path');

var PLUGIN_NAME = 'gulp-rev-outdated';

function plugin(keepQuantity) {
    'use strict';
    keepQuantity = parseInt(keepQuantity) || 2;
    var lists = {};

    return through.obj(function (file, enc, cb) {
        var regex = new RegExp('^(.*)-[0-9a-f]{8,10}(?:\\.min)?\\' + path.extname(file.path) + '$');
        if (regex.test(file.path)) {
            var identifier = regex.exec(file.path)[1] + path.extname(file.path);
            if (lists[identifier] === undefined) {
                lists[identifier] = [];
            }
            lists[identifier].push({
                file: file,
                time: file.stat.ctime.getTime()
            });
        }
        cb();
    }, function (cb) {
        Object.keys(lists).forEach(function (identifier) {
            lists[identifier].sort(function (a, b) {
                    return b.time - a.time;
                })
                .slice(keepQuantity)
                .forEach(function (f) {
                    this.push(f.file);
                }, this);
        }, this);
        cb();
    });
}

module.exports = plugin;
