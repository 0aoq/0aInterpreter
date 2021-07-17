import { createCmdFromFile, functions, getFromHold, handleCommand, removeVariable, variables } from '../../../core/index.js';
import * as utility from '../../../core/utility.js'

createCmdFromFile("func", false, function ($) {
    let $name = utility.getArgs($.cmd, 2, 0).split(" do")[0]

    if (utility.getFunction($name) == null && $name != "null") {
        functions.push({
            name: $name,
            run: getFromHold($name).lines,
            nestedto: $.callingFrom || "null"
        })

        setTimeout(() => {
            getFromHold($name).lines = ['parsed', `line: ${getFromHold($name).on}`]
        }, 10);
    } else if (utility.getFunction($name).run[0].split(" ")[0] != "func") { // fix strange error on nested functions where it would try to duplicate
        return handleCommand(`SyntaxError Function has already been declared.`, $.callingFrom, $.addToVariables, $.line)
    }
})

createCmdFromFile("run", false, function ($) {
    if (utility.getArgs($.cmd, 2, 1) && utility.$checkBrackets(utility.getArgs($.cmd, 2, 1))) {
        let args = utility.parseFunction(utility.getArgs($.cmd, 2, 1)).split(", ")

        let returned = $.cmd.split(" ")[1]

        if (utility.getFunction(returned).name) {
            if (utility.getFunction(returned).nestedto == "null" || utility.getFunction(returned).nestedto == $.callingFrom) {
                if (args) {
                    for (let arg of args) {
                        let $name = arg.split(" = ")[0]
                        let $value = arg.split(" = ")[1]

                        for (let val of variables) {
                            if (val.function == utility.getFunction(returned).name) {
                                val.name = "&;0a__val:reset"
                                val.val = ""
                            }
                        }

                        if ($name && $value) {
                            handleCommand(`val ${$name} = ${$value}`, utility.getFunction(returned).name || "null", "", 1)
                        }
                    }
                }

                let uniqueId = "__&func:" + utility.getFunction(returned).name
                for (let command of utility.getFunction(returned).run) {
                    handleCommand(utility.parseVariables(command, utility.getFunction(returned).name, uniqueId, false, $.file), utility.getFunction(returned).name, uniqueId)
                }
            }
        } else {
            handleCommand(`SyntaxError Function "${returned}" does not exist.`, $.callingFrom, $.addToVariables, $.line)
        }
    } else {
        handleCommand("SyntaxError Brackets were not opened and closed properly.", $.callingFrom, $.addToVariables, $.line)
    }
})