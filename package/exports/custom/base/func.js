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
index_js_1.createCmdFromFile("func", false, function ($) {
    let $name = utility.getArgs($.cmd, 2, 0).split(" do")[0];
    if (utility.getFunction($name) == null && $name != "null") {
        index_js_1.functions.push({
            name: $name,
            run: index_js_1.getFromHold($name).lines,
            nestedto: $.callingFrom || "null"
        });
        setTimeout(() => {
            index_js_1.getFromHold($name).lines = ['parsed', `line: ${index_js_1.getFromHold($name).on}`];
        }, 10);
    }
    else if (utility.getFunction($name).run[0].split(" ")[0] != "func") { // fix strange error on nested functions where it would try to duplicate
        return index_js_1.handleCommand(`SyntaxError Function has already been declared.`, $.callingFrom, $.addToVariables, $.line);
    }
});
index_js_1.createCmdFromFile("run", false, function ($) {
    if (utility.getArgs($.cmd, 2, 1) && utility.$checkBrackets(utility.getArgs($.cmd, 2, 1))) {
        let args = utility.parseFunction(utility.getArgs($.cmd, 2, 1)).split("; ");
        let returned = $.cmd.split(" ")[1];
        if (utility.getFunction(returned).name) {
            if (utility.getFunction(returned).nestedto == "null" || utility.getFunction(returned).nestedto == $.callingFrom) {
                if (args) {
                    for (let arg of args) {
                        let $name = arg.split(" = ")[0];
                        let $value = arg.split(" = ")[1];
                        for (let val of index_js_1.variables) {
                            if (val.function == utility.getFunction(returned).name) {
                                val.name = "&;0a__val:reset";
                                val.val = "";
                            }
                        }
                        utility.makeVariable($name, $value, $value, utility.getFunction(returned).name || "null");
                    }
                }
                let uniqueId = "__&func:" + utility.getFunction(returned).name;
                for (let command of utility.getFunction(returned).run) {
                    command = command.replace("    ", ""); // remove \t spaces
                    command = command.replace("\t", ""); // remove \t spaces
                    index_js_1.handleCommand(utility.parseVariables(command, utility.getFunction(returned).name, uniqueId), utility.getFunction(returned).name, uniqueId);
                }
            }
        }
        else {
            index_js_1.handleCommand(`SyntaxError Function "${returned}" does not exist.`, $.callingFrom, $.addToVariables, $.line);
        }
    }
    else {
        index_js_1.handleCommand("SyntaxError Brackets were not opened and closed properly.", $.callingFrom, $.addToVariables, $.line);
    }
});
