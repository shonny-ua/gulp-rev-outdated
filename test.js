'use strict';
var assert          = require('assert');
var gutil           = require('gulp-util');
var revOutdated     = require('./index');
var path            = require('path');

var assets = [
    {path: 'css/style.css',          time: 0},
    {path: 'css/stylexxx.css',       time: 0},
    {path: 'css/style-22222222.css', time: 1403184415416},
    {path: 'css/style-61e0be79.css', time: 1403184377571},
    {path: 'css/style-a42f5380.css', time: 1403184303451},
    {path: 'css/style-1d87bebe.css', time: 1222222222222},
    {path: 'css/style-11111111.css', time: 1111111111111},
    {path: 'css/style-00000000.css', time: 0},
];

var keepQuantity;
var filteredQantity;
var fileCount;

it('should filter 5 files', function (cb) {
    keepQuantity = 1;
    filteredQantity = 6 - keepQuantity;
    fileCount = 0;

    var stream = initStream( revOutdated(keepQuantity) );

    stream.on('data', streamDataCheck);

    stream.on('end', function() {
        assert.equal(fileCount, filteredQantity, 'Only ' + filteredQantity + ' files should pass through the stream');
        cb();
    });

    stream.end();
});

it('should filter 4 files using default keepQuantity option', function (cb) {
    keepQuantity = undefined;
    filteredQantity = 6 - 2;
    fileCount = 0;

    var stream = initStream( revOutdated() );

    stream.on('data', streamDataCheck);

    stream.on('end', function() {
        assert.equal(fileCount, filteredQantity, 'Only ' + filteredQantity + ' files should pass through the stream');
        cb();
    });

    stream.end();
});

it('should filter correct files', function (cb) {
    keepQuantity = 3;
    filteredQantity = 6 - keepQuantity;
    fileCount = 0;

    var stream = initStream( revOutdated(keepQuantity) );

    stream.on('data', function(file){
        streamDataCheck(file);
        assert(
        /\/style-(1d87bebe|11111111|00000000)\.css/.test(file.path),
        'should filter correct files'
    );
    });

    stream.on('end', function() {
        assert.equal(fileCount, filteredQantity, 'Only ' + filteredQantity + ' files should pass through the stream');
        cb();
    });

    stream.end();
});

function initStream(stream) {
    assets.forEach(function(asset){
        stream.write(new gutil.File({
            path: asset.path,
            stat: {ctime: new Date(asset.time)},
            contents: new Buffer(' ')
        }));
    });
    return stream;
}

function streamDataCheck (file) {
    assert(
        /\/style-[0-9a-f]{8}\.css/.test(file.path),
        'should filter only revisioned files'
    );
    fileCount++;
}
