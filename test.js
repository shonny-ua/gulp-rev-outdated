'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var revOutdated = require('./index');
var path = require('path');

var assets = [
    {path: 'css/style.css', time: 0},
    {path: 'css/stylexxx.css', time: 0},
    {path: 'css/style-22222222.css', time: 1403184415416},
    {path: 'css/style-61e0be79.css', time: 1403184377571},
    {path: 'css/style-a42f5380.css', time: 1403184303451},
    {path: 'css/style-1d87bebe.css', time: 1222222222222},
    {path: 'css/style-11111111.css', time: 1111111111111},
    {path: 'css/style-11111111.min.css', time: 1111111111111},
    {path: 'css/style-00000000.css', time: 0},
    // Additional unique file
    {path: 'css/vendor.css', time: 0},
    {path: 'css/vendorxxx.css', time: 0},
    {path: 'css/vendor-22222222.css', time: 1403184415416},
    {path: 'css/vendor-61e0be79.css', time: 1403184377571},
    {path: 'css/vendor-a42f5380.css', time: 1403184303451},
    {path: 'css/vendor-1d87bebe.css', time: 1222222222222},
    {path: 'css/vendor-11111111.css', time: 1111111111111},
    {path: 'css/vendor-11111111.min.css', time: 1111111111111},
    {path: 'css/vendor-00000000.css', time: 0},
    // Additional unique another type file
    {path: 'css/vendor.js', time: 0},
    {path: 'css/vendorxxx.js', time: 0},
    {path: 'css/vendor-22222222.js', time: 1403184415416},
    {path: 'css/vendor-61e0be79.js', time: 1403184377571},
    {path: 'css/vendor-a42f5380.js', time: 1403184303451},
    {path: 'css/vendor-1d87bebe.js', time: 1222222222222},
    {path: 'css/vendor-11111111.js', time: 1111111111111},
    {path: 'css/vendor-11111111.min.js', time: 1111111111111},
    {path: 'css/vendor-00000000.js', time: 0},
    // Test nested files
    {path: 'css/fonts/fontstyle.css', time: 0},
    {path: 'css/fonts/fontstylexxx.css', time: 0},
    {path: 'css/fonts/fontstyle-22222222.css', time: 1403184415416},
    {path: 'css/fonts/fontstyle-61e0be79.css', time: 1403184377571},
    {path: 'css/fonts/fontstyle-a42f5380.css', time: 1403184303451},
    {path: 'css/fonts/fontstyle-1d87bebe.css', time: 1222222222222},
    {path: 'css/fonts/fontstyle-11111111.css', time: 1111111111111},
    {path: 'css/fonts/fontstyle-11111111.min.css', time: 1111111111111},
    {path: 'css/fonts/fontstyle-00000000.css', time: 0},
    // Try to trip regex
    {path: 'css/try-to-trip-regex.css', time: 0},
    {path: 'css/try-to-trip-regexxxx.css', time: 0},
    {path: 'css/try-to-trip-regex-22222222.css', time: 1403184415416},
    {path: 'css/try-to-trip-regex-61e0be79.css', time: 1403184377571},
    {path: 'css/try-to-trip-regex-a42f5380.css', time: 1403184303451},
    {path: 'css/try-to-trip-regex-1d87bebe.css', time: 1222222222222},
    {path: 'css/try-to-trip-regex-11111111.css', time: 1111111111111},
    {path: 'css/try-to-trip-regex-11111111.min.css', time: 1111111111111},
    {path: 'css/try-to-trip-regex-00000000.css', time: 0}
];

var keepQuantity;
// Uniques in 'assets'
var uniqueFiles = 5;
var filteredQuantity;
var fileCount;
var actualFiles;

it('should filter 30 files', function (cb) {
    keepQuantity = 1;
    fileCount = 0;
    actualFiles = [];
    var expectedOutdatedFiles = [
        "css/style-61e0be79.css",
        "css/style-a42f5380.css",
        "css/style-1d87bebe.css",
        "css/style-11111111.css",
        "css/style-00000000.css",
        "css/vendor-61e0be79.css",
        "css/vendor-a42f5380.css",
        "css/vendor-1d87bebe.css",
        "css/vendor-11111111.css",
        "css/vendor-00000000.css",
        "css/vendor-61e0be79.js",
        "css/vendor-a42f5380.js",
        "css/vendor-1d87bebe.js",
        "css/vendor-11111111.js",
        "css/vendor-00000000.js",
        "css/fonts/fontstyle-61e0be79.css",
        "css/fonts/fontstyle-a42f5380.css",
        "css/fonts/fontstyle-1d87bebe.css",
        "css/fonts/fontstyle-11111111.css",
        "css/fonts/fontstyle-00000000.css",
        "css/try-to-trip-regex-61e0be79.css",
        "css/try-to-trip-regex-a42f5380.css",
        "css/try-to-trip-regex-1d87bebe.css",
        "css/try-to-trip-regex-11111111.css",
        "css/try-to-trip-regex-00000000.css"
    ];
    filteredQuantity = expectedOutdatedFiles.length;

    var stream = initStream(revOutdated(keepQuantity));

    stream.on('data', streamDataCheck);

    stream.on('end', function () {
        assert.equal(fileCount, filteredQuantity, 'Only ' + filteredQuantity + ' files should pass through the stream');
        assert.deepEqual(actualFiles, expectedOutdatedFiles);
        cb();
    });

    stream.end();
});

it('should filter 25 files of different types using default keepQuantity option', function (cb) {
    keepQuantity = undefined;
    fileCount = 0;
    actualFiles = [];
    var expectedOutdatedFiles = [
        "css/style-a42f5380.css",
        "css/style-1d87bebe.css",
        "css/style-11111111.css",
        "css/style-00000000.css",
        "css/vendor-a42f5380.css",
        "css/vendor-1d87bebe.css",
        "css/vendor-11111111.css",
        "css/vendor-00000000.css",
        "css/vendor-a42f5380.js",
        "css/vendor-1d87bebe.js",
        "css/vendor-11111111.js",
        "css/vendor-00000000.js",
        "css/fonts/fontstyle-a42f5380.css",
        "css/fonts/fontstyle-1d87bebe.css",
        "css/fonts/fontstyle-11111111.css",
        "css/fonts/fontstyle-00000000.css",
        "css/try-to-trip-regex-a42f5380.css",
        "css/try-to-trip-regex-1d87bebe.css",
        "css/try-to-trip-regex-11111111.css",
        "css/try-to-trip-regex-00000000.css"
    ];
    filteredQuantity = expectedOutdatedFiles.length;

    var stream = initStream(revOutdated());

    stream.on('data', function (file) {
        streamDataCheck(file);
        assert(
            !/\/vendor-61e0be79\.(css|js)$/.test(file.path),
            'should filter correct files'
        );
    });

    stream.on('end', function () {
        assert.equal(fileCount, filteredQuantity, 'Only ' + filteredQuantity + ' files should pass through the stream');
        assert.deepEqual(actualFiles, expectedOutdatedFiles);
        cb();
    });

    stream.end();
});

it('should filter correct files', function (cb) {
    keepQuantity = 3;
    fileCount = 0;
    actualFiles = [];
    var expectedOutdatedFiles = [
        "css/style-1d87bebe.css",
        "css/style-11111111.css",
        "css/style-00000000.css",
        "css/vendor-1d87bebe.css",
        "css/vendor-11111111.css",
        "css/vendor-00000000.css",
        "css/vendor-1d87bebe.js",
        "css/vendor-11111111.js",
        "css/vendor-00000000.js",
        "css/fonts/fontstyle-1d87bebe.css",
        "css/fonts/fontstyle-11111111.css",
        "css/fonts/fontstyle-00000000.css",
        "css/try-to-trip-regex-1d87bebe.css",
        "css/try-to-trip-regex-11111111.css",
        "css/try-to-trip-regex-00000000.css"
    ];
    filteredQuantity = expectedOutdatedFiles.length;

    var stream = initStream(revOutdated(keepQuantity));

    stream.on('data', function (file) {
        streamDataCheck(file);
        assert(
            /\/(style|vendor|fontstyle|try-to-trip-regex)-(1d87bebe|11111111|00000000)(?:\.min)?\.(css|js)$/.test(file.path),
            'should filter correct files'
        );
    });

    stream.on('end', function () {
        assert.equal(fileCount, filteredQuantity, 'Only ' + filteredQuantity + ' files should pass through the stream');
        assert.deepEqual(actualFiles, expectedOutdatedFiles);
        cb();
    });

    stream.end();
});

function initStream(stream) {
    assets.forEach(function (asset) {
        stream.write(new gutil.File({
            path: asset.path,
            stat: {ctime: new Date(asset.time)},
            contents: new Buffer(' ')
        }));
    });
    return stream;
}

function streamDataCheck(file) {
    assert(
        /\/(style|vendor|fontstyle|try-to-trip-regex)-[0-9a-f]{8}(?:\.min)?\.(css|js)$/.test(file.path),
        'should filter only revisioned files'
    );
    fileCount++;
    actualFiles.push(file.path);
}
