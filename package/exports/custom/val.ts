import { createCmdFromFile, getLineAfterCmd, handleCommand } from '../../core/index.js';
import { $checkBrackets, $checkQuotes, getArgs, getVariable, makeVariable, parseVariables } from '../../core/utility.js';

createCmdFromFile("val", false, function ($) {
    $.cmd = parseVariables($.cmd, $.callingFrom, $.addToVariables) // allow for the ability to assign variables to other variables

    let $name = getLineAfterCmd($.cmd, 'val')
    let $value = $name.split(" = ")[1]

    if (isNaN(parseInt($value))) {
        if (!getVariable($value)) {
            if ($value[0] == '"') {
                if ($checkQuotes($value)) {
                    makeVariable($name, $value, $value.split('"')[1].split('"')[0], $.callingFrom || null, "string")
                } else {
                    handleCommand("SyntaxError string was not closed properly.", $.callingFrom, $.addToVariables, $.line)
                }
            } else if ($value[0] == '{') {
                if ($checkBrackets($value)) {
                    makeVariable($name, $value, $.callingFrom || null, "table")
                } else {
                    handleCommand("SyntaxError brackets not opened and closed properly.", $.callingFrom, $.addToVariables, $.line)
                }
            } else {
                makeVariable($name, $value, $value, $.callingFrom || null)
            }
        }
    } else if (!isNaN(parseInt($value))) {
        makeVariable($name, parseInt($value), parseInt($value), $.callingFrom || null, "int")
    }
})