"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../../core/index.js");
const utility_js_1 = require("../../../core/utility.js");
index_js_1.createCmdFromFile("log", false, function ($) {
    $.cmd = utility_js_1.parseVariablesFromWords($.cmd, $.callingFrom, $.addToVariables);
    let after = index_js_1.getLineAfterCmd($.cmd, "log");
    // really long error handling section
    if (utility_js_1.parseFunction(after)[0] === '"') { // is a string
        if (utility_js_1.$checkBrackets(after)) {
            if (utility_js_1.$checkQuotes(utility_js_1.parseFunction(after))) {
                console.log(utility_js_1.parseString(utility_js_1.parseFunction(after)));
            }
            else {
                index_js_1.handleCommand("SyntaxError quotes weren't closed properly for log function.", $.callingFrom, $.addToVariables, $.line);
            }
        }
        else {
            index_js_1.handleCommand("SyntaxError brakets were not closed properly for log function.", $.callingFrom, $.addToVariables, $.line);
        }
    }
    else if (utility_js_1.parseFunction(after)[0] == "{") {
        if (utility_js_1.$checkBrackets(after)) {
            console.log(JSON.parse(utility_js_1.parseFunction(after)));
        }
        else {
            index_js_1.handleCommand("SyntaxError brakets were not closed properly for log function.", $.callingFrom, $.addToVariables, $.line);
        }
    }
    else if (utility_js_1.getVariable(utility_js_1.parseFunction(after)) || !isNaN(parseInt(utility_js_1.parseFunction(after)))) { // is a variable/int
        if (utility_js_1.$checkBrackets(after)) {
            if (utility_js_1.getVariable(utility_js_1.parseFunction(after))) { // specific for variable
                let variable = utility_js_1.getVariable(utility_js_1.parseFunction(after));
                if (variable.__type == "table") {
                    console.log(JSON.parse(variable.absoluteValue)); // parse to table
                }
                else {
                    console.log(variable.absoluteValue);
                }
            }
            else {
                if (!isNaN(parseInt(utility_js_1.parseFunction(after)))) { // number
                    console.log(parseInt(utility_js_1.parseFunction(after)));
                }
                else { // any
                    console.log(utility_js_1.parseFunction(after));
                }
            }
        }
        else {
            index_js_1.handleCommand("SyntaxError brakets were not closed properly for log function.", $.callingFrom, $.addToVariables, $.line);
        }
    }
    else {
        index_js_1.handleCommand("SyntaxError log type not recognized.", $.callingFrom, $.addToVariables, $.line);
    }
});
