import { createCmdFromFile, getLineAfterCmd, handleCommand } from '../../../core/index.js';
import { $checkBrackets, $checkQuotes, getArgs, getVariable, parseFunction, parseString, parseVariablesFromWords } from '../../../core/utility.js';

createCmdFromFile("log", false, function ($) {
    $.cmd = parseVariablesFromWords($.cmd, $.callingFrom, $.addToVariables)
    let after = getLineAfterCmd($.cmd, "log")
    
    // really long error handling section
    if (parseFunction(after)[0] === '"') { // is a string
        if ($checkBrackets(after)) {
            if ($checkQuotes(parseFunction(after))) {
                console.log(parseString(parseFunction(after)))
            } else {
                handleCommand("SyntaxError quotes weren't closed properly for log function.", $.callingFrom, $.addToVariables, $.line)
            }
        } else {
            handleCommand("SyntaxError brakets were not closed properly for log function.", $.callingFrom, $.addToVariables, $.line)
        }
    } else if (parseFunction(after)[0] == "{") {
        if ($checkBrackets(after)) {
            console.log(JSON.parse(parseFunction(after)))
        } else {
            handleCommand("SyntaxError brakets were not closed properly for log function.", $.callingFrom, $.addToVariables, $.line)
        }
    } else if (getVariable(parseFunction(after)) || !isNaN(parseInt(parseFunction(after)))) { // is a variable/int
        if ($checkBrackets(after)) {
            if (getVariable(parseFunction(after))) { // specific for variable
                let variable = getVariable(parseFunction(after))
                if (variable.__type == "table") {
                    console.log(JSON.parse(variable.absoluteValue)) // parse to table
                } else {
                    console.log(variable.absoluteValue)
                }
            } else {
                if (!isNaN(parseInt(parseFunction(after)))) { // number
                    console.log(parseInt(parseFunction(after)))
                } else { // any
                    console.log(parseFunction(after))
                }
            }
        } else {
            handleCommand("SyntaxError brakets were not closed properly for log function.", $.callingFrom, $.addToVariables, $.line)
        }
    } else {
        handleCommand("SyntaxError log type not recognized.", $.callingFrom, $.addToVariables, $.line)
    }
})