'use strict';
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var through = require('through2');
var path = require('path');

var PLUGIN_NAME = 'gulp-rev-outdated';

function plugin(keepQuantity) {
    keepQuantity = parseInt(keepQuantity) || 2;
    var lists = {};

    return through.obj(function (file, enc, cb) {
        var regex = new RegExp('^(.*)-[0-9a-f]{8}\\' + path.extname(file.path) + '$');
        if (regex.test(file.path)) {
            var n = regex.exec(file.path)[1];
            if (lists[n] === undefined) {
                lists[n] = [];
            }
            lists[n].push({
                file: file,
                time: file.stat.ctime.getTime()
            });
        }
        cb();
    }, function (cb) {
        var t = this;
        Object.keys(lists).forEach(function (val) {
            lists[val].sort(function (a, b) {
                return b.time - a.time;
            })
                .slice(keepQuantity)
                .forEach(function (f) {
                    t.push(f.file);
                }, t);
        });
        cb();
    });
}

module.exports = plugin;