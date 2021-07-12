import { createCmdFromFile, getLineAfterCmd, handleCommand } from '../../core/index.js';
import { $checkBrackets, getVariable, makeVariable, sleep } from '../../core/utility.js';

createCmdFromFile("for", false, function ($) {
    // experimental command: Currently undocumented, command has barely been tested.
    // WIP Syntax: 'for i < 5, 0 do log ("Hello, world!")'

    let after = getLineAfterCmd($.cmd, "for")
    let split__do = after.split(" do ")

    if ($checkBrackets(split__do[0])) {
        let split__less_than = split__do[0].split(" < ")

        if (split__less_than[0] != undefined && !isNaN(parseInt(split__less_than[1].split(", ")[0]))) {
            makeVariable(split__less_than[0], 0, 0, "forloop", "int") // create time waited variable

            async function __worker (split__less_than, split__do, $) {
                for (let i = 0; i < parseInt(split__less_than[1].split(", ")[0]) + 1; i++) {
                    if (i < parseInt(split__less_than[1].split(", ")[0]) - 1) {
                        handleCommand(split__do[1], "forloop", $.addToVariables, $.line)
                        await sleep(parseInt(split__less_than[1].split(", ")[1]))
                    } else if (i < parseInt(split__less_than[1].split(", ")[0])) { // reset time waited so it can be reused by other for statements
                        getVariable("$:" + split__less_than[0] + "__&func:forloop", "forloop").val++ // round time waited up to total
                        getVariable("$:" + split__less_than[0] + "__&func:forloop", "forloop").name = "[loop finished]"
                    }

                    if (getVariable("$:" + split__less_than[0] + "__&func:forloop", "forloop")) {
                        getVariable("$:" + split__less_than[0] + "__&func:forloop", "forloop").val++ // update time waited: log ($:i)
                    }
                }
            }

            __worker(split__less_than, split__do, $) // break into function for async
        }
    }
})