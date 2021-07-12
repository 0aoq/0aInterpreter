"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../../core/index.js");
const utility_js_1 = require("../../../core/utility.js");
index_js_1.createCmdFromFile("if", false, function ($) {
    // experimental command: Currently undocumented, command has barely been tested.
    // WIP Syntax: 'if x == y do log ("true") else log ("false")'
    $.cmd = utility_js_1.parseVariables($.cmd, $.callingFrom, $.addToVariables);
    let after = index_js_1.getLineAfterCmd($.cmd, "if");
    let split__do = after.split(" do ");
    if (utility_js_1.$checkBrackets(split__do[0])) {
        let split__statement = split__do[0].split(" == ");
        let split__else = split__do[1].split(" else ");
        if (split__statement[0] == split__statement[1]) {
            index_js_1.handleCommand(split__do[1], $.callingFrom, $.addToVariables, $.line);
        }
        else if (split__statement[0] != split__statement[1]) {
            if (split__else[1]) {
                index_js_1.handleCommand(split__else[1], $.callingFrom, $.addToVariables, $.line);
            }
        }
    }
});
index_js_1.createCmdFromFile("ifnot", false, function ($) {
    // experimental command: Currently undocumented, command has barely been tested.
    // WIP Syntax: 'ifnot x == y do log ("false") else log("true")'
    $.cmd = utility_js_1.parseVariables($.cmd, $.callingFrom, $.addToVariables);
    let after = index_js_1.getLineAfterCmd($.cmd, "ifnot");
    let split__do = after.split(" do ");
    if (utility_js_1.$checkBrackets(split__do[0])) {
        let split__statement = split__do[0].split(" == ");
        let split__else = split__do[1].split(" else ");
        if (split__statement[0] != split__statement[1]) {
            index_js_1.handleCommand(split__do[1], $.callingFrom, $.addToVariables, $.line);
        }
        else {
            if (split__else[1]) {
                index_js_1.handleCommand(split__else[1], $.callingFrom, $.addToVariables, $.line);
            }
        }
    }
});
