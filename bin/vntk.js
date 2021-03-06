#!/usr/bin/env node

'use strict'
const _ = require('lodash')
const chalk = require('chalk')
const program = require('commander')
const version = require('../package').version
const tokenize = require('../src/vntk/tokenizer/tokenize')
const word_tokenize = require('../src/vntk/tokenizer/word_tokenize')

var NOOP = function () {};
var help = function () {
    // Allow us to display help(), but omit the wildcard (*) command.
    program.commands = _.reject(program.commands, {
        _name: '*'
    })
    program.help()
}

/**
 * Normalize cli version argument, i.e.
 * 
 * $ vntk -v
 * $ vntk -V
 * $ vntk --version
 * $ vntk version
 */
program.version(version, "-v, --version")

/**
 * make '-v' option case-insensitive
 */
process.argv = _.map(process.argv, function (arg) {
    return (arg === '-V') ? '-v' : arg;
});

/**
 * $ vntk version (--version synonym)
 */
program
    .command("version")
    .description("")
    .action(function () {
        program.emit("version")
    })

/*
 * Vntk Tokenizer
 * */
program
    .command('tokenize [file...]')
    .option('-e --ext', 'File extension', 'txt')
    .option('-o --output', 'Output file name or directory', '.')
    .description('Break text into arrays of tokens')
    .alias('tok')
    .action(function (files, opts) {
        tokenize(files, opts).then((result) => {
            console.log(`
            $ vntk tokenize success!
                input: ${chalk.green(result.input)}            
                output: ${chalk.green(result.output)}            
                extension: ${chalk.green(opts.ext)}            
            `)
        }).catch((err) => {
            console.log(`
            $ vntk tokenizer got an error, please report with these information:
                @vntk/cli (version): ${chalk.green(version)}
                input: ${chalk.green(result.input)}            
                output: ${chalk.green(result.output)}            
                detail: ${chalk.red(err)}
            `)
        })
    })
    .on("--help", function () {
        console.log(`
            Examples:
                $ vntk tokenize input.txt
                $ vntk tok input.txt --ext txt --output ./out
        `);
    })

/*
 * Vntk Word Tokenizer
 * */
program
    .command('word-tokenize [file...]')
    .option('-e --ext', 'File extension', 'txt')
    .option('-o --output', 'Output file name or directory', '.')
    .description('Break text into arrays of tokens')
    .alias('ws')
    .action(function (files, opts) {
        word_tokenize(files, opts).then((result) => {
            console.log(`
            $ vntk word tokenize success!
                input: ${chalk.green(result.input)}            
                output: ${chalk.green(result.output)}            
                extension: ${chalk.green(opts.ext)}            
            `)
        }).catch((err) => {
            console.log(`
            $ vntk word tokenizer got an error, please report with these information:
                @vntk/cli (version): ${chalk.green(version)}
                input: ${chalk.green(result.input)}            
                output: ${chalk.green(result.output)}            
                detail: ${chalk.red(err)}
            `)
        })
    })
    .on("--help", function () {
        console.log(`
            Examples:
                $ vntk word-tokenize input.txt
                $ vntk ws input.txt --ext txt --output ./dist
        `);
    })


/**
 * Vntk help
 */
program
    .command("*")
    .action(help);

/**
 * Vntk cli arguments parser
 */
program.parse(process.argv)

// NO_COMMAND_SPECIFIED 
if (!program.args.length) {
    program.help()
}