'use strict';
const fs = require('fs');
const path = require('path');
const vntk = require('vntk');
const discover = require('../discover')

const tokenizer = vntk.tokenizer();
const logger = vntk.logger('cli-tokenizer');

/**
 * Tokenize text files
 * @param {string} files String or an Array
 * @param {Object} options 
 */
module.exports = function tokenize(files, options) {
    if (typeof files === 'string') {
        files = [files]
    }

    // listing input and discover files
    files.forEach((file) => {
        discover(file, options.ext, function (fileName) {
            // reading and process data file
            logger.info('Preprocessing file: ' + fileName);
            fs.readFile(fileName, function read(err, data) {
                var basePath = path.resolve(fileName);
                var outputFileName = basePath + '.tok';
                var result = tokenizer.tokenize(data.toString());
                fs.writeFile(outputFileName, result, function (err) {
                    if (!err) {
                        logger.info('Done:', outputFileName);
                    } else {
                        logger.error("Process file error: " + fileName, err);
                    }
                });
            })
        })
    });
    return Promise.resolve(options);
}