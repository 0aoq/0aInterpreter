"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("../../index.js");
var utility_js_1 = require("../utility.js");
var fs = require('fs');
index_js_1.createCmdFromFile("lua.new", true, function ($) {
    if (index_js_1.imported[0].lua == true) {
        var name_1 = utility_js_1.getArgs($.cmd, 2, 0).split(" do")[0].split(" --sandbox ")[0];
        setTimeout(function () {
            var CreateFiles = fs.createWriteStream(process.cwd() + "/" + name_1 + ".lua", {
                flags: 'a'
            });
            for (var _i = 0, _a = index_js_1.getFromHold(name_1).lines; _i < _a.length; _i++) {
                var line = _a[_i];
                CreateFiles.write(line + '\r\n');
            }
        }, 1);
    }
    else {
        return index_js_1.handleCommand("SyntaxError \"lua.new\" is not recognized as a valid keyword. Did you forget to import lua?", "lua", "", 1);
    }
});
