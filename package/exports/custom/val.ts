import { createCmdFromFile, getLineAfterCmd, handleCommand } from '../../index.js';
import { $checkQuotes, getArgs, getVariable, makeVariable } from '../utility.js';

createCmdFromFile("val", false, function ($) {
    let $name = getLineAfterCmd($.cmd, 'val').slice(1)
    let $value = $name.split(" = ")[1]

    if (isNaN(parseInt($value))) {
        if (!getVariable($value)) {
            if ($value[0] == '"') {
                if ($checkQuotes($value)) {
                    makeVariable($name, $value.split('"')[1].split('"')[0], $.callingFrom || null, "string")
                } else {
                    handleCommand("SyntaxError string was not closed properly.", $.callingFrom, $.addToVariables, $.line)
                }
            } else {
                makeVariable($name, $value, $.callingFrom || null)
            }
        }
    } else if (!isNaN(parseInt($value))) {
        makeVariable($name, parseInt($value), $.callingFrom || null, "int")
    }
})