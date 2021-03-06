// npx tsc parse.ts
// node parse.js

import * as readline from 'readline'
import * as fs from 'fs'
import * as path from 'path'
import * as http from 'http'
const colors = require("colors") // node module doesn't work well with import, ???

import * as inquirer from 'inquirer'

import * as utility from './utility.js'
import { parse } from '../exports/parse.js'
import { configparse } from '../exports/configparse.js'
import { Node, NodeType, NodeScope, Token } from './datatypes.js';

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    res.write(`
    <script>
        window.location = "https://0aoq.github.io/0aInterpreter"
    </script>
    `);

    res.end();
}).listen(8080);

export let variables = []
export let functions = []

// main

export let parsedLines = []
export let parseHold = []

export let config = [{
    "allowMultiLine": true,
    "allowFileLoading": true,
    "specifyVal": true
}]

export let imported = [{
    html: false,
    css: false,
    lua: false
}]

export function getFromHold($name) {
    for (let value of parseHold) {
        if (value.name == $name) {
            return value
        }
    }
}

let file_cmds = []
export let multi_line_required = ['func']

export const createCmdFromFile = function (name: string, multiline: boolean, run: any) {
    if (name && run) {
        utility.cmds.push(name)

        if (multiline) {
            multi_line_required.push(name)
        }

        file_cmds.push({
            name: name,
            run: run
        })
    }
}

function searchDirForCmds(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.log(err)
        }

        files.forEach(file => {
            if (file.split(".")[1] == "js") { // file extension
                setTimeout(() => {
                    require(dir + "/" + file)
                }, 100);
            }
        });
    });
}

searchDirForCmds(path.resolve(__dirname, "../", "exports", "custom")) // custom cmds
searchDirForCmds(path.resolve(__dirname, "../", "exports", "custom", "base")) // base built in cmds

function getFromCustomCmds(name: string) {
    for (let datapoint of file_cmds) {
        if (datapoint.name == name) {
            return datapoint
        }
    }
}

// cmd functions

export const findCmd = function (cmd, list = utility.cmds) {
    let split = cmd.split(" ")
    let __indexed = 0

    for (let $cmd of list) {
        for (let space of split) {
            if (__indexed <= 3) { // limit
                if (space == $cmd) {
                    return $cmd
                }
            }
        }
    }
}

export const getLineAfterCmd = function (cmd: string, splitBy: string) {
    return cmd.split(splitBy)[1].slice(1)
}

export const getLineBeforeCmd = function (cmd: string, splitBy: string) {
    return cmd.split(splitBy)[0]
}

// run

export const handleCommand = async function (
    cmd: string,
    callingFrom: string = "null",
    addToVariables: string = "",
    line?: number,
    afterInput?,
    file: string = null
) {
    // all new required commands should be created in a custom command file.

    for (let i = 0; i < 10000; i++) { // remove tabs up to 10,000, Error: cmd.replaceAll is not a function.
        cmd = cmd.replace("    ", "") // remove \t spaces
        cmd = cmd.replace("\t", "") // remove \t spaces
    }

    let $ = cmd.split(" ")

    if ($) {
        if ($[0] == "#") { return }

        if ($[0] == "SyntaxError") { // &;cmd[SyntaxErorr]
            console.log(colors.bold(colors.red(`[!] (${line || 1}) SyntaxError: ${utility.getArgs(cmd, 2, 0)}`)))
        }
        else if ($[0] == "cd") { // &;cmd[cd]
            handleCommand('log (val:$cd)', callingFrom, addToVariables, line)
        } else if ($[0] == "clear") { // &;cmd[clear]
            console.clear()
        } else if ($[0] == "exec") { // &;cmd[exec]
            parse(cmd, callingFrom, addToVariables, line)
        }
        else if ($[0] == "debug") { // &;cmd[debug]
            let $_ = utility.getArgs(cmd, 2, 0)

            if ($_ == "variables") {
                console.log(variables)
            } else if ($_ == "functions") {
                console.log(functions)
            } else if ($_ == "within") {
                console.log(callingFrom)
            } else if ($_ == "parsehold") {
                console.log(parseHold)
            } else if ($_ == "parsedlines") {
                console.log(parsedLines)
            } else if ($_ == "dictionary") {
                console.log(utility.cmds)
            } else if ($_ == "imported") {
                console.log(imported)
            } else if ($_ == "customcmds") {
                console.log(file_cmds)
            } else if ($_ == "permissions") {
                console.log(config[0])
            } else if ($_ == "all") {
                console.log([{
                    variables: JSON.stringify(variables),
                    functions: JSON.stringify(functions),
                    within: callingFrom,
                    parsehold: JSON.stringify(parseHold),
                    parsedLines: JSON.stringify(parsedLines),
                    dictionary: utility.cmds,
                    fileDictionary: JSON.stringify(file_cmds),
                    permissions: JSON.stringify(config[0])
                }])
            }
        }
        // ===============
        // UTIL FUNCTIONS
        // ===============
        else if ($[0] == "sleep") { // &;cmd[sleep]
            if (utility.$checkBrackets(cmd.slice(4))) {
                let split = cmd.slice(4).split(")")[0].split("(")[1]
                await utility.sleep(parseInt(split))
            } else {
                handleCommand("SyntaxError Brackets were not opened and closed properly.", callingFrom, addToVariables, line)
            }
        } else if ($[0] == "import") {
            let service = utility.parseString(utility.getArgs(cmd, 2, 0))

            if (service) {
                imported[0][service] = true
            } else {
                handleCommand("SyntaxError Service not defined.", callingFrom, addToVariables, line)
            }
        }
        // ===============
        // IF NO CMD
        // ===============
        else if ($[0] == "set") { // &;cmd[set]
            handleCommand(`val ${cmd.split("set ")[1]}`, callingFrom, addToVariables, line, afterInput, file)
        } else if (!cmd.split(" ") || !utility.cmds.includes(cmd.split(" ")[0]) && !getFromCustomCmds(cmd.split(" ")[0])) {
            let $spaces = cmd.split(" ")

            if ($spaces.length >= 2) {
                // IF A SECOND WORD EXISTS
                if (utility.$checkBrackets(cmd) && utility.parseFunction(cmd) && !isNaN(parseInt(utility.parseFunction(cmd).split(" ")[0]))) {
                    // RUN MATHEMATICS; EXAMPLE: (1 + 2)
                    utility.math(utility.parseFunction(cmd))
                } else if (utility.getFunction($spaces[0]) && $spaces[1][0] == "(" && utility.$checkBrackets(getLineAfterCmd(cmd, $spaces[0]))) {
                    // RUN FUNCTIONS WITHOUT TYPING "run" COMMAND
                    handleCommand(`run ${$spaces[0]} (${utility.parseFunction(getLineAfterCmd(cmd, $spaces[0]))})`)
                } else {
                    // COMMAND DOESN'T EXIST
                    handleCommand(`SyntaxError "${cmd}" is not recognized as a valid keyword.`, callingFrom, addToVariables, line)
                }
            } else {
                // THROW ERROR IF NO SECOND WORD
                handleCommand(`SyntaxError "${cmd}" is not recognized as a valid keyword.`, callingFrom, addToVariables, line)
            }
        }
        // ===============
        // FILE CMDS
        // ===============
        for (let $cmd of cmd.split("; ")) {
            let __spaces = $cmd.split(" ")
            for (let space of __spaces) {
                let __cmd = getFromCustomCmds(space)
                if (__cmd && __spaces.indexOf(__cmd.name) <= 3) { // limit position that cmd can be called from to be 3 or under
                    const custom_cmd = __cmd

                    const __result = custom_cmd.run({
                        cmd: cmd,
                        callingFrom: callingFrom,
                        addToVariables: addToVariables,
                        line: line,
                        file: file,

                        before: getLineBeforeCmd($cmd, custom_cmd.name),
                        after: getLineAfterCmd($cmd, custom_cmd.name)
                    })

                    const expression: Node = { // command status operation
                        nodeType: NodeType.ReturnStatement,
                        nodeScope: NodeScope.OneTime,
                        evalutated: false,
                        result: null // unneeded
                    }

                    if (afterInput) {
                        afterInput(__result)
                    }

                    expression.evalutated = true

                    if (!expression.evalutated) {
                        console.log(colors.bold(colors.red("Return statement has not yet been evalutated, an error might've occured.")))
                    }
                }
            }
        }
    }
}

// .0aconfig
configparse()

// variables

export const removeVariable = function (variable) {
    variables = utility.removeFromArray(variables, variables.indexOf(variable))
}

// question prompt

console.log('')
console.log(colors.bold(colors.magenta('0a Interpreter ')) + 'Release Version: 0.8.1')
console.log('')

const promptcmd = function () {
    let cmd_input = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    cmd_input.question("[&] ", function (cmd) {
        handleCommand(cmd)
        cmd_input.close()
        promptcmd()
    })
}

inquirer.prompt([{
    type: 'rawlist',
    name: 'action',
    message: 'What do you want to do?',
    choices: [
        'Load from files',
        'Enter command'
    ],
}]).then((answers) => {
    if (answers.action == "Load from files") {
        inquirer.prompt([{
            type: 'input',
            name: 'filelocation',
            message: 'Where would you like to load files from? (cd/scripts)',
        }]).then(($answers) => {
            if (config[0].allowFileLoading == true) {
                if ($answers.filelocation == "") {
                    const __path = path.resolve(process.cwd(), "scripts")

                    // LOAD .0a FILES FROM WORKING DIRECTORY/scripts

                    fs.readdir(__path, (err, files) => {
                        if (err) {
                            return console.log(`Directory doesn't exist! Exiting to command line.`), promptcmd()
                        } else {
                            files.forEach(file => {
                                setTimeout(() => {
                                    handleCommand("exec " + path.resolve(__path, file))
                                }, 100);
                            });

                            promptcmd()
                        }
                    });
                } else {
                    // LOAD .0a FILES FROM DIRECT LOCATION

                    fs.readdir($answers.filelocation, (err, files) => {
                        if (err) {
                            return console.log(`Directory doesn't exist! Exiting to command line.`), promptcmd()
                        } else {
                            files.forEach(file => {
                                setTimeout(() => {
                                    handleCommand("exec " + $answers.filelocation + "/" + file)
                                }, 100);
                            });

                            promptcmd()
                        }
                    });
                }
            } else {
                promptcmd()
            }
        });
    } else {
        promptcmd()
    }
})

// defaults

process.title = "0a Interpreter" // IF LAUNCHING FROM A COMMAND LINE, SET THE TITLE

export default {
    handleCommand,
    variables,
    functions,
    parseHold,
    parsedLines,
    getFromHold,
    createCmdFromFile,
    imported,
    multi_line_required,
    findCmd,
    getLineAfterCmd,
    getLineBeforeCmd
}

process.on('uncaughtException', (error) => {
    console.log('0aInterpreter has encountered an error: ' + colors.bold(colors.red(error.toString())))
    process.exit(1)
})