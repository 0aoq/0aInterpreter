import { createCmdFromFile, findCmd, getLineAfterCmd, handleCommand } from '../../../core/index.js';
import { $checkBrackets, $checkQuotes, cmds, getVariable, makeVariable, parseVariables } from '../../../core/utility.js';

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
            } else if (findCmd($value)) {
                let __cmd = findCmd($value)
                let __after = getLineAfterCmd($value, __cmd)

                handleCommand(`${__cmd} ${__after}`, $.callingFrom, $.addToVariables, $.line, function (input) {
                    makeVariable($name, input, input, $.callingFrom || null, "0a__function_return_value--NODE_TYPE:ReturnStatement")
                })
            } else {
                // makeVariable($name, $value, $value, $.callingFrom || null)
                handleCommand(`SyntaxError Variable type not specified.`, $.callingFrom, $.addToVariables, $.line)
            }
        }
    } else if (!isNaN(parseInt($value))) {
        makeVariable($name, parseInt($value), parseInt($value), $.callingFrom || null, "int")
    }
})