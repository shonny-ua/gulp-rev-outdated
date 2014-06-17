var through = require('through2');
var path    = require('path');

function plugin(keepQuantity){
    keepQuantity = parseInt(keepQuantity) || 2;
    var list = [];
    
    return through.obj(function (file, enc, cb) {
        if ( new RegExp( '-[0-9a-f]{8}\\' + path.extname(file.path) + '$' ).test(file.path) ) {
            list.push({
                file: file,
                time: file.stat.ctime.getTime()
            });
        }
        cb();
    }, function (cb) {
        list.sort(function(a, b){
            return b.time - a.time;
        })
        .slice(keepQuantity)
        .forEach(function(f){
            this.push(f.file);
        }, this);

        cb();
    });
}

module.exports = plugin;