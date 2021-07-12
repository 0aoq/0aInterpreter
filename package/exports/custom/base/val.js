"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../../core/index.js");
const utility_js_1 = require("../../../core/utility.js");
index_js_1.createCmdFromFile("val", false, function ($) {
    $.cmd = utility_js_1.parseVariables($.cmd, $.callingFrom, $.addToVariables); // allow for the ability to assign variables to other variables
    let $name = index_js_1.getLineAfterCmd($.cmd, 'val');
    let $value = $name.split(" = ")[1];
    if (isNaN(parseInt($value))) {
        if (!utility_js_1.getVariable($value)) {
            if ($value[0] == '"') {
                if (utility_js_1.$checkQuotes($value)) {
                    utility_js_1.makeVariable($name, $value, $value.split('"')[1].split('"')[0], $.callingFrom || null, "string");
                }
                else {
                    index_js_1.handleCommand("SyntaxError string was not closed properly.", $.callingFrom, $.addToVariables, $.line);
                }
            }
            else if ($value[0] == '{') {
                if (utility_js_1.$checkBrackets($value)) {
                    utility_js_1.makeVariable($name, $value, $.callingFrom || null, "table");
                }
                else {
                    index_js_1.handleCommand("SyntaxError brackets not opened and closed properly.", $.callingFrom, $.addToVariables, $.line);
                }
            }
            else {
                utility_js_1.makeVariable($name, $value, $value, $.callingFrom || null);
            }
        }
    }
    else if (!isNaN(parseInt($value))) {
        utility_js_1.makeVariable($name, parseInt($value), parseInt($value), $.callingFrom || null, "int");
    }
});
