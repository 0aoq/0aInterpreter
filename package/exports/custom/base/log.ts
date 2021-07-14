import { Token } from '../../../core/datatypes.js';
import { createCmdFromFile, findCmd, getLineAfterCmd, handleCommand } from '../../../core/index.js';
import { $checkBrackets, $checkQuotes, cmds, getArgs, getVariable, parseDoubleFunction, parseFunction, parseString, parseVariablesFromWords } from '../../../core/utility.js';

createCmdFromFile("log", false, function ($) {
    $.cmd = parseVariablesFromWords($.cmd, $.callingFrom, $.addToVariables, $.file)
    let after = getLineAfterCmd($.cmd, "log")
    
    // really long error handling section
    if (parseFunction(after) && $checkBrackets(after)) {
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
        } else if ( // is a variable/int
            getVariable(parseFunction(after), $.callingFrom, $.file) || 
            !isNaN(parseInt(parseFunction(after))) || 
            cmds.includes(parseFunction(after).split(" ")[0]
        )) {
            if ($checkBrackets(after)) {
                if (getVariable(parseFunction(after), $.callingFrom, $.file)) { // specific for variable
                    let variable = getVariable(parseFunction(after), $.callingFrom, $.file)
                    console.log(variable.absoluteValue)
                } else if (cmds.includes(parseFunction(after).split(" ")[0])) {
                    let __cmd = parseDoubleFunction(after)
                    
                    handleCommand(`${__cmd}`, $.callingFrom, $.addToVariables, $.line, function (input) {
                        console.log(input)
                    })
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
    } else {
        handleCommand("SyntaxError brakets were not closed properly for log function.", $.callingFrom, $.addToVariables, $.line)
    }
})