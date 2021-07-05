"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
var index_js_1 = require("../index.js");
var utility_js_1 = require("./utility.js");
var colors = require('colors');
var fs = require('fs');
function parse(cmd, callingFrom, addToVariables, line) {
    var $ = cmd.split(" ");
    $ = cmd.split($[0]);
    var returned = $[1].slice(1);
    if (returned.split(".")[1] == "0a") {
        fs.readFile(returned, 'utf8', function (err, data) {
            if (err) {
                return console.log(colors.bold(colors.red("Error: " + err)));
            }
            if (data) {
                // split the contents by new line
                var lines = data.split(/\r?\n/);
                var self_1 = {
                    name: null,
                    active: false,
                    lines: [],
                    on: 0,
                    sandboxed: false
                };
                var parsed_1 = 0;
                // print all lines
                lines.forEach(function (line) {
                    parsed_1++;
                    function $s() {
                        console.log(index_js_1.multi_line_required);
                        index_js_1.parseHold.push({
                            name: utility_js_1.getArgs(line, 2, 0).split(" do")[0].split(" --sandbox ")[0],
                            active: false,
                            lines: [],
                            on: parsed_1,
                            sandboxed: utility_js_1.getBoolean(utility_js_1.getArgs(line, 2, 0).split(" do")[0].split(" --sandbox ")[1]) || false
                        });
                        self_1 = index_js_1.getFromHold(utility_js_1.getArgs(line, 2, 0).split(" do")[0].split(" --sandbox ")[0]);
                        self_1.active = true;
                        index_js_1.handleCommand(line, callingFrom, addToVariables, parsed_1);
                        index_js_1.parsedLines.push(line);
                    }
                    // better multiline support for parser: still needs to be worked on!
                    if (line.trim().length !== 0) {
                        for (var i = 0; i < 10000; i++) { // remove tabs up to 10,000
                            if (!self_1.sandboxed) {
                                line = line.replace("    ", ""); // remove \t spaces
                                line = line.replace("\t", ""); // remove \t spaces
                            }
                        }
                        if (self_1.active == false) {
                            if (index_js_1.multi_line_required.includes(line.split(" ")[0])) {
                                $s();
                            }
                            else {
                                index_js_1.handleCommand(line, callingFrom, addToVariables, parsed_1);
                                index_js_1.parsedLines.push(line);
                            }
                        }
                        else {
                            if (line.split(" ")[0] == "end") {
                                if (line.split(" ")[1] == self_1.name) {
                                    self_1.active = false;
                                    setTimeout(function () {
                                        self_1.lines = ['parsed', "file lines: " + parsed_1];
                                        self_1 = {
                                            name: null,
                                            active: false,
                                            lines: [],
                                            on: 0,
                                            sandboxed: false
                                        };
                                    }, 100);
                                }
                            }
                            else if (line.split(" ")[0] == "thread:end") {
                                if (line.split(" ")[1] == self_1.name) {
                                    self_1.active = false;
                                    setTimeout(function () {
                                        self_1.lines = ['parsed', "file lines: " + parsed_1];
                                        self_1 = {
                                            name: null,
                                            active: false,
                                            lines: [],
                                            on: 0,
                                            sandboxed: false
                                        };
                                    }, 100);
                                }
                            }
                            else {
                                if (index_js_1.multi_line_required.includes(line.split(" ")[0])) {
                                    $s();
                                }
                                if (self_1.name != null) {
                                    self_1.lines.push(line);
                                }
                                else {
                                    index_js_1.parsedLines.push(line);
                                }
                            }
                        }
                        for (var _i = 0, parseHold_1 = index_js_1.parseHold; _i < parseHold_1.length; _i++) {
                            var held = parseHold_1[_i];
                            if (held.active == true) {
                                self_1 = held;
                            }
                        }
                    }
                });
            }
            else {
                index_js_1.handleCommand("SyntaxError File has no data.", callingFrom, addToVariables, line);
            }
        });
    }
    else {
        return index_js_1.handleCommand("SyntaxError File must be a .0a file", callingFrom, addToVariables);
    }
}
exports.parse = parse;
