"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../../core/index.js");
const utility = __importStar(require("../../../core/utility.js"));
const fs = require('fs');
const colors = require('colors');
const path = require("path");
index_js_1.createCmdFromFile("read", false, function ($) {
    let returned = utility.parseVariables(utility.getArgs($.cmd, 2, 0), $.callingFrom);
    console.log(returned);
    fs.readFile(returned, 'utf8', function (err, data) {
        if (err) {
            console.log(colors.bold(colors.red(`SyntaxError: ${err}`)));
        }
        console.log('\x1b[32m%s\x1b[0m', '=====================');
        console.log(data);
        console.log('\x1b[32m%s\x1b[0m', '=====================');
    });
});
index_js_1.createCmdFromFile("write", false, function ($) {
    let $name = utility.getArgs($.cmd, 2, 0).split(" ")[0];
    let $data = utility.getArgs($.cmd, 2, 1);
    utility.parseVariables($name, $.callingFrom);
    utility.writeReturnErr($name, $data, false);
});
index_js_1.createCmdFromFile("write_add", false, function ($) {
    let $name = utility.getArgs($.cmd, 2, 0).split(" ")[0];
    let $data = utility.getArgs($.cmd, 2, 1);
    utility.parseVariables($name, $.callingFrom);
    utility.writeReturnErr($name, $data, true);
});
index_js_1.createCmdFromFile("rm", false, function ($) {
    try {
        fs.unlinkSync(utility.getArgs($.cmd, 2, 0));
    }
    catch (err) {
        return console.log(colors.bold(colors.red(`Error: ${err}`)));
    }
});
index_js_1.createCmdFromFile("listdir", false, function ($) {
    fs.readdir(utility.getArgs($.cmd, 2, 0), (err, files) => {
        if (err) {
            return console.log(colors.bold(colors.red(`Error: ${err}`)));
        }
        files.forEach(file => {
            console.log(file);
        });
    });
});
index_js_1.createCmdFromFile("mk", false, function ($) {
    if ($.cmd.split(" ")[1] == "includedir") {
        fs.mkdir(path.join(process.cwd(), $.cmd.split(" ")[2].split("/")[0]), (err) => {
            if (err) {
                return console.log(colors.bold(colors.red(`[!] Error: ${err}`)));
            }
        });
    }
    fs.writeFile(utility.parseVariables($.cmd.split(" ")[2], $.callingFrom), "", function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Created.");
        }
    });
});
