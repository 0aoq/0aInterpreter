import { Token } from "./0NODE.js"
import { handleCommand, variables, functions, parseHold, parsedLines, config } from "./index.js"

const fs = require("fs")
const colors = require("colors")

export const $checkBrackets = function (expr) {
    const holder = []
    const openBrackets = ['(', '{', '[']
    const closedBrackets = [')', '}', ']']
    for (let letter of expr) {
        if (openBrackets.includes(letter)) {
            holder.push(letter)
        } else if (closedBrackets.includes(letter)) {
            const openPair = openBrackets[closedBrackets.indexOf(letter)]
            if (holder[holder.length - 1] === openPair) {
                holder.splice(-1, 1)
            } else {
                holder.push(letter)
                break
            }
        }
    }
    return (holder.length === 0) // return true if length is 0, otherwise false
}

export const $checkQuotes = function (expr) {
    if (expr[0] == '"' && expr.slice(-1) == '"') {
        return true
    } else {
        return false
    }
}

export const writeReturnErr = function (fileName: string, newdata: string, add: boolean) {
    fs.readFile(fileName, 'utf8', function (err, data) {
        /* if (err) {
            return
        } */

        let $ = newdata
        if (add) {
            $ = data += newdata
        }

        fs.writeFile(fileName, $, function (err) {
            if (err) return console.log(err)
        })
    })
}

export async function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

export const getArgs = function (cmd: string, limit: number, split: number) {
    let $ = cmd.split(" ", limit)
    $ = cmd.split($[split])

    let returned = $[1].slice(1)
    return returned
}

// helpers

function assignVariableAbsolute(__val) {
    if (__val.__type === "string") {
        __val.absoluteValue = __val.val.split('"')[1].split('"')[0]
    } else {
        __val.absoluteValue = __val.val
    }

    return __val
}

export const makeVariable = function (
    $name: string, $value: any,
    $absoluteValue: any,
    $function,
    $type: string = "undefined",
    $mods: string[] = [],
    $file: string = null
) {
    if ($function == "null") {
        if (getVariable('val:' + $name.split(" = ")[0], $function, $file) == null) {
            if (!config[0].specifyVal) { // <specifyVal>    </specifyVal>
                variables.push(
                    {
                        name: $name.split(" = ")[0],
                        val: $value,
                        absoluteValue: $absoluteValue,
                        function: "null",
                        modifiers: $mods,
                        __type: $type,
                        file: $file
                    }
                )
            } else {
                variables.push(
                    {
                        name: 'val:' + $name.split(" = ")[0],
                        val: $value,
                        absoluteValue: $absoluteValue,
                        function: "null",
                        modifiers: $mods,
                        __type: $type,
                        file: $file
                    }
                )
            }
        } else {
            let __val = getVariable('val:' + $name.split(" = ")[0], $function, $file)

            if (!__val.modifiers.includes('static')) {
                __val.val = $value
                __val = assignVariableAbsolute(__val)
                __val.__type = $type
            } else if (__val.modifiers.includes('static')) {
                handleCommand(`SyntaxError Attempted to reassign a static variable.`, $function)
            }
        }
    } else {
        if (getVariable('$:' + $name.split(" = ")[0], $function, $file) == null) {
            variables.push(
                {
                    name: '$:' + $name.split(" = ")[0] + "__&func:" + $function,
                    val: $value,
                    absoluteValue: $absoluteValue,
                    function: $function,
                    modifiers: $mods,
                    __type: $type,
                    file: $file
                }
            )
        } else {
            let __val = getVariable('val:' + $name.split(" = ")[0], $function, $file)

            __val.val = $value
            __val = assignVariableAbsolute(__val)
            __val.__type = $type
        }
    }
}

export const getVariable = function ($name: string, $function: string = "null", file: string) {
    if ($function == "null") {
        for (let variable of variables) {
            if (variable.name == $name && variable.file == file) {
                return variable
            }
        }
    } else {
        console.log(file)
        for (let variable of variables) {
            if (variable.name == $name && $function == variable.function && variable.file == file) {
                return variable
            }
        }
    }
}

export const getFunction = function ($name: string) {
    for (let func of functions) {
        if (func.name == $name) {
            return func
        }
    }
}

// Parsing helper functions

export const parseVariables = function (
    $content: string, 
    $calling: string = "null", 
    $add: string = "", 
    $absolute: boolean = false,
    $file: string
) {
    $content = $content.split("//")[0]

    let words = $content.split(" ")
    for (let word of words) {
        let $ = word + $add

        let val = getVariable($, $calling, $file)

        if (val != null) {
            if (!$absolute) {
                if (val.function == "null") {
                    $content = $content.replace(word, getVariable($, $calling, $file).val)
                } else {
                    if ($calling = val.function) {
                        $content = $content.replace(word, getVariable($, $calling, $file).val)
                    }
                }
            } else {
                if (val.function == "null") {
                    $content = $content.replace(word, getVariable($, $calling, $file).absoluteValue)
                } else {
                    if ($calling = val.function) {
                        $content = $content.replace(word, getVariable($, $calling, $file).absoluteValue)
                    }
                }
            }
        }
    }

    let __words = $content.split(")")[0].split("(")

    for (let word of __words) {
        let $ = word + $add

        let val = getVariable($, $calling, $file)

        if (val != null) {
            if (val.function == "null") {
                $content = $content.replace(word, getVariable($, $calling, $file).val)
            } else {
                if ($calling = val.function) {
                    $content = $content.replace(word, getVariable($, $calling, $file).val)
                }
            }
        }
    }

    return $content
}

export let cmds = [ // list of allowed keywords
    'val', 'repeat', 'func', 'run', 'cd', 'clear', 'write', 'write_add', 'rm',
    'listdir', 'mk', 'exec', 'debug', 'set', '#',
    'end'
]

export let $functions = [
    'log', 'run'
]

export let modifiers = [
    'static'
]

export const parseCommands = function ($content: string, $calling: string = "null") {
    let words = $content.split(" ")

    for (let word of words) {
        if ($functions.includes(word) && $checkBrackets(word)) {
            // $content = $content.replace(word, handleCommand(word.split("(")[0], $calling))
            console.log($content)
        }
    }

    return $content
}

export const parseCommands2 = function ($content: string, $calling: string = "null") {
    let words = $content.split(" ")

    for (let word of words) {
        if ($checkBrackets(word.split("cmd:")[1])) {
            if (parseFunction(word.split("cmd:")[1])) {
                handleCommand(parseFunction(word.split("cmd:")[1]), $calling, "", 1)
            }
        }
    }
}

export const parseString = function ($content: string) {
    return $content.split(Token.STRING)[1].split(Token.STRING)[0]
}

export const parseFunction = function ($content: string) {
    return $content.split(Token.CLOSEFUNC)[0].split(Token.OPENFUNC)[1]
}

export const parseDoubleFunction = function ($content: string, start: number = 0) {
    let __ = $content.split(Token.CLOSEFUNC)[start].split(Token.OPENFUNC)
    return __[start + 1] + "(" + __[start + 2] + ")"
}

export let returnedFromLine = []

export function getFromReturned(line) {
    for (let datapoint of returnedFromLine) {
        if (datapoint.line = line) {
            return datapoint
        }
    }
}

export const returnValue = function ($line: number, $value: string) {
    returnedFromLine.push({
        line: $line,
        return: $value
    })
}

export const getBoolean = function ($string: string) {
    if ($string == "true") {
        return true
    } else if ($string == "false") {
        return false
    } else {
        return null
    }
}

export const splitFlags = function ($string: string, flag: string) {
    return $string.split("--" + flag)
}

export const parseVariablesFromWords = function (s, callingFrom, addToVariables, file) {
    let $ = s.split(" ")

    for (const $_ of $) { // parse all variables from every word
        s.replace($_, parseVariables($_, callingFrom, addToVariables, false, file))
    }

    return s
}

export const math = function (cmd) {
    const spaces = cmd.split(" ")

    for (let space of spaces) {
        if (!isNaN(parseInt(space))) {
            let index = spaces.indexOf(space)

            let operator = spaces[index + 1]

            let num1 = parseInt(spaces[index])
            let num2 = parseInt(spaces[index + 2])

            let supportedOperators = [
                Token.PLUS,
                Token.MINUS,
                Token.AST,
                Token.CARET,
                Token.RSLASH,
                '_/'
            ]

            if (!isNaN(num2) && !isNaN(num1) && supportedOperators.includes(operator)) {
                if (operator == Token.PLUS) {
                    console.log(num1 + num2)
                } else if (operator == Token.MINUS) {
                    console.log(num1 - num2)
                } else if (operator == Token.AST) {
                    console.log(num1 * num2)
                } else if (operator == Token.RSLASH) {
                    console.log(num1 / num2)
                } else if (operator == Token.CARET) {
                    console.log(Math.pow(num1, num2))
                } else {
                    handleCommand(`SyntaxError Operator not supported/undefined.`)
                }
            } else if (!isNaN(num1) && supportedOperators.includes(operator)) {
                if (operator == "_/") {
                    console.log(Math.sqrt(num1))
                } else {
                    handleCommand(`SyntaxError Operator not supported/undefined.`)
                }
            }
        }
    }
}

export const replaceValue = function (cmd: string, toReplace: string, value: string) {
    cmd = cmd.replaceAll(toReplace, value)
    return cmd
}

export const getStringType = function ($value: string) { // WIP
    if (isNaN(parseInt($value))) {
        if ($value[0] == Token.STRING) {
            return 'string'
        } else if ($value[0] == Token.OPEN_BRACE) {
            if ($checkBrackets($value)) {
                return 'table'
            } else {
                handleCommand("SyntaxError brackets not opened and closed properly.", "getStringType", "", 1)
            }
        } else {
            return 'null'
        }
    } else if (!isNaN(parseInt($value))) {
        return 'int'
    }
}

export const removeFromArray = function (array, indexOf) {
    for (var i = 0; i < array.length; i++) {
        if (i === indexOf) {
            array.splice(i, 1);
        }
    }

    return array
}

// exports

export default { // every default function
    returnValue,
    // get functions
    getFromReturned,
    getArgs,
    getFunction,
    getVariable,
    getBoolean,
    getStringType,
    // parsers
    parseString,
    parseVariables,
    parseCommands,
    parseCommands2,
    parseFunction,
    parseVariablesFromWords,
    parseDoubleFunction,
    // checks
    $checkBrackets,
    $checkQuotes,
    // unnamed
    cmds,
    $functions,
    sleep,
    writeReturnErr,
    makeVariable,
    splitFlags,
    math,
    replaceValue,
    removeFromArray,
    modifiers
};