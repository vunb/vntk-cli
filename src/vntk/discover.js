'use strict';
var fs = require('fs');
var path = require('path');
var logger = require('vntk').logger('cli-discover');

/**
 * Autodiscover files and directories
 * Example: 
 *      fromDir('../file/or/dir/name', /\.txt$/, function (filename) {
 *          console.log('-- processing: ', filename);
 *      });
 * 
 * @param {String} startPath file or folder path.
 * @param {RegExp} filter Regular express filter
 * @param {Function} callback Callback handler
 */
module.exports = function fromDir(startPath, filter, callback) {

    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    if (typeof filter === 'string') {
        filter = new RegExp(`.${filter}$`);
    }

    // check if input is a file
    var statFile = fs.lstatSync(startPath);
    if (!statFile.isDirectory()) {
        logger.debug('Input is a file:', startPath);            
        return callback(startPath);
    }

    // discover files
    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            // recurs
            fromDir(filename, filter, callback);
        } else if (filter.test(filename)) {
            logger.debug('Found:', filename);            
            callback(filename);
        } else {
            logger.debug('Unknow file ext:', filename);
        }
    }
}