import { Token } from '../../../core/datatypes.js';
import { createCmdFromFile, findCmd, getLineAfterCmd, getLineBeforeCmd, handleCommand } from '../../../core/index.js';
import { $checkBrackets, $checkQuotes, cmds, getVariable, makeVariable, parseVariables } from '../../../core/utility.js';

createCmdFromFile("val", false, function ($) {
    $.cmd = parseVariables($.cmd, $.callingFrom, $.addToVariables, false, $.file) // allow for the ability to assign variables to other variables
    
    let $name = $.after.split("> ")[1] || $.after // split by "<MOD> " or don't split if split point doesn't exist
    let $value = $name.split(" = ")[1]
    let mods = []

    for (let space of $.after.split(" ")) {
        if (space[0] == Token.LT) {
            mods = $.after.split(Token.GT)[0].split(Token.LT)[1].split(", ") // <static>
        }
    }

    if (!mods.includes("filelocked")) {
        $.file = null
    }

    if (isNaN(parseInt($value))) {
        if (!getVariable($value, $.callingFrom, $.file)) {
            if ($value[0] == '"') {
                if ($checkQuotes($value)) {
                    makeVariable($name, $value, $value.split('"')[1].split('"')[0], $.callingFrom || null, "string", mods, $.file)
                } else {
                    handleCommand("SyntaxError string was not closed properly.", $.callingFrom, $.addToVariables, $.line, $.file)
                }
            } else if ($value[0] == '{') {
                if ($checkBrackets($value)) {
                    makeVariable($name, $value, JSON.stringify($value), $.callingFrom || null, "table", mods, $.file)
                } else {
                    handleCommand("SyntaxError brackets not opened and closed properly.", $.callingFrom, $.addToVariables, $.line, $.file)
                }
            } else if (findCmd($value)) {
                let __cmd = findCmd($value)
                let __after = getLineAfterCmd($value, __cmd)

                handleCommand(`${__cmd} ${__after}`, $.callingFrom, $.addToVariables, $.line, function (input) {
                    makeVariable($name, input, input, $.callingFrom || null, "0a__function_return_value--NODE_TYPE:ReturnStatement", mods, $.file)
                })
            } else {
                // makeVariable($name, $value, $value, $.callingFrom || null)
                handleCommand(`SyntaxError Variable type not specified.`, $.callingFrom, $.addToVariables, $.line, $.file)
            }
        }
    } else if (!isNaN(parseInt($value))) {
        makeVariable($name, parseInt($value), parseInt($value), $.callingFrom || null, "int", mods, $.file)
    }
})