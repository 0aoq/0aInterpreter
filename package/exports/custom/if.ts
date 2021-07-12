import { createCmdFromFile, getLineAfterCmd, handleCommand } from '../../core/index.js';
import { $checkBrackets, parseVariables } from '../../core/utility.js';

createCmdFromFile("if", false, function ($) {
    // experimental command: Currently undocumented, command has barely been tested.
    // WIP Syntax: 'if x == y do log ("true") else log ("false")'

    $.cmd = parseVariables($.cmd, $.callingFrom, $.addToVariables)

    let after = getLineAfterCmd($.cmd, "if")
    let split__do = after.split(" do ")

    if ($checkBrackets(split__do[0])) {
        let split__statement = split__do[0].split(" == ")
        let split__else = split__do[1].split(" else ")

        if (split__statement[0] == split__statement[1]) {
            handleCommand(split__do[1], $.callingFrom, $.addToVariables, $.line)
        } else if (split__statement[0] != split__statement[1]) {
            if (split__else[1]) {
                handleCommand(split__else[1], $.callingFrom, $.addToVariables, $.line)
            }
        }
    }
})

createCmdFromFile("ifnot", false, function ($) {
    // experimental command: Currently undocumented, command has barely been tested.
    // WIP Syntax: 'ifnot x == y do log ("false") else log("true")'

    $.cmd = parseVariables($.cmd, $.callingFrom, $.addToVariables)

    let after = getLineAfterCmd($.cmd, "ifnot")
    let split__do = after.split(" do ")

    if ($checkBrackets(split__do[0])) {
        let split__statement = split__do[0].split(" == ")
        let split__else = split__do[1].split(" else ")

        if (split__statement[0] != split__statement[1]) {
            handleCommand(split__do[1], $.callingFrom, $.addToVariables, $.line)
        } else {
            if (split__else[1]) {
                handleCommand(split__else[1], $.callingFrom, $.addToVariables, $.line)
            }
        }
    }
})