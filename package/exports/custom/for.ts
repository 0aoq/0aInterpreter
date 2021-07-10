import { createCmdFromFile, getLineAfterCmd, handleCommand } from '../../core/index.js';
import { $checkBrackets, getVariable, makeVariable } from '../../core/utility.js';

createCmdFromFile("for", false, function ($) {
    // experimental command: Currently undocumented, command has barely been tested.
    // WIP Syntax: 'for i < 5 do log ("Hello, world!")'

    let after = getLineAfterCmd($.cmd, "for")
    let split__do = after.split(" do ")

    if ($checkBrackets(split__do[0])) {
        let split__less_than = split__do[0].split(" < ")

        if (split__less_than[0] != undefined && !isNaN(parseInt(split__less_than[1]))) {
            makeVariable(split__less_than[0], 0, "forloop", "int")

            for (let i = 0; i < parseInt(split__less_than[1]) + 1; i++) {
                if (i < parseInt(split__less_than[1])) {
                    handleCommand(split__do[1], "forloop", $.addToVariables, $.line)
                } else if (i < parseInt(split__less_than[1]) + 1) {
                    getVariable("$:" + split__less_than[0] + "__&func:forloop", "forloop").name = "[loop finished]"
                }
            }
        }
    }
})