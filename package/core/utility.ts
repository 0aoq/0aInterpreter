import { handleCommand, variables, functions, parseHold, parsedLines } from "./index.js"

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

export const makeVariable = function ($name: string, $value: any, $function, $type: string = "undefined") {
    if ($function == "null") {
        if (getVariable('val:' + $name.split(" = ")[0], $function) == null) {
            variables.push(
                {
                    name: 'val:' + $name.split(" = ")[0],
                    val: $value,
                    function: "null",
                    __type: $type
                }
            )
        } else {
            getVariable('val:' + $name.split(" = ")[0], $function).val = $value
        }
    } else {
        if (getVariable('$:' + $name.split(" = ")[0], $function) == null) {
            variables.push(
                {
                    name: '$:' + $name.split(" = ")[0] + "__&func:" + $function,
                    val: $value,
                    function: $function,
                    __type: $type
                }
            )
        } else {
            getVariable('$:' + $name.split(" = ")[0], $function).val = $value
        }
    }
}

export const getVariable = function ($name: string, $function: string = "null") {
    if ($function == "null") {
        for (let variable of variables) {
            if (variable.name == $name) {
                return variable
            }
        }
    } else {
        for (let variable of variables) {
            if (variable.name == $name && $function == variable.function) {
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

export const parseVariables = function ($content: string, $calling: string = "null", $add: string = "") {
    $content = $content.split("//")[0]

    let words = $content.split(" ")
    for (let word of words) {
        let $ = word + $add

        let val = getVariable($, $calling)

        if (val != null) {
            if (val.function == "null") {
                $content = $content.replace(word, getVariable($, $calling).val)
            } else {
                if ($calling = val.function) {
                    $content = $content.replace(word, getVariable($, $calling).val)
                }
            }
        }
    }

    let __words = $content.split(")")[0].split("(")

    for (let word of __words) {
        let $ = word + $add

        let val = getVariable($, $calling)

        if (val != null) {
            if (val.function == "null") {
                $content = $content.replace(word, getVariable($, $calling).val)
            } else {
                if ($calling = val.function) {
                    $content = $content.replace(word, getVariable($, $calling).val)
                }
            }
        }
    }

    return $content
}

export let cmds = [ // list of allowed keywords
    'val', 'repeat', 'func', 'run', 'cd', 'clear', 'write', 'write_add', 'rm',
    'listdir', 'mk', 'exec', 'calc', 'debug', 'set', '//', 'if', 'ifnot', 'rest',
    '{/end}'
]

export let $functions = [
    'log', 'run'
]

export const parseCommands = function ($content: string, $calling: string = "null") {
    let words = $content.split(" ")

    for (let word of words) {
        if ($functions.includes(word) && $checkBrackets(word)) {
            $content = $content.replace(word, handleCommand(word.split("(")[0], $calling))
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
    return $content.split('"')[1].split('"')[0]
}

export const parseFunction = function ($content: string) {
    return $content.split(")")[0].split("(")[1]
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
    }
}

export const splitFlags = function ($string: string, flag: string) {
    return $string.split("--" + flag)
}

export const parseVariablesFromWords = function(s, callingFrom, addToVariables) {
    let $ = s.split(" ")

    for (const $_ of $) { // parse all variables from every word
        s.replace($_, parseVariables($_, callingFrom, addToVariables))
    }

    return s
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
    // parsers
    parseString,
    parseVariables,
    parseCommands,
    parseCommands2,
    parseFunction,
    parseVariablesFromWords,
    // checks
    $checkBrackets,
    $checkQuotes,
    // unnamed
    cmds,
    $functions,
    sleep,
    writeReturnErr,
    makeVariable,
    splitFlags
};