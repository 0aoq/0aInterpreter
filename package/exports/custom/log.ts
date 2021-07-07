import { createCmdFromFile, handleCommand } from '../../core/index.js';
import { $checkBrackets, $checkQuotes, getArgs, getVariable, parseFunction, parseString, parseVariablesFromWords } from '../../core/utility.js';

createCmdFromFile("log", false, function ($) {
    $.cmd = parseVariablesFromWords($.cmd, $.callingFrom, $.addToVariables)
    // really long error handling section
    if (parseFunction(getArgs($.cmd, 2, 0))[0] === '"') { // is a string
        if ($checkBrackets($.cmd.slice(4))) {
            if ($checkQuotes(parseFunction(getArgs($.cmd, 2, 0)))) {
                console.log(parseString(parseFunction(getArgs($.cmd, 2, 0))))
            } else {
                handleCommand("SyntaxError quotes weren't closed properly for log function.", $.callingFrom, $.addToVariables, $.line)
            }
        } else {
            handleCommand("SyntaxError brakets were not closed properly for log function.", $.callingFrom, $.addToVariables, $.line)
        }
    } else if (getVariable(parseFunction(getArgs($.cmd, 2, 0))) || !isNaN(parseInt(parseFunction(getArgs($.cmd, 2, 0))))) { // is a variable/int
        if ($checkBrackets($.cmd.slice(4))) {
            if (getVariable(parseFunction(getArgs($.cmd, 2, 0)))) { // specific for variable
                console.log(getVariable(parseFunction(getArgs($.cmd, 2, 0))).val)
            } else {
                if (!isNaN(parseInt(parseFunction(getArgs($.cmd, 2, 0))))) { // number
                    console.log(parseInt(parseFunction(getArgs($.cmd, 2, 0))))
                } else { // any
                    console.log(parseFunction(getArgs($.cmd, 2, 0)))
                }
            }
        } else {
            handleCommand("SyntaxError brakets were not closed properly for log function.", $.callingFrom, $.addToVariables, $.line)
        }
    } else {
        handleCommand("SyntaxError log type not recognized.", $.callingFrom, $.addToVariables, $.line)
    }
})