// npx tsc parse.ts
// node parse.js

const readline = require('readline')
const fs = require('fs')
const path = require('path')
const http = require('http')
const colors = require('colors');

const inquirer = require('inquirer')
const clui = require('clui')

import {
    returnValue,
    getFromReturned,
    getArgs,
    getFunction,
    getVariable,
    parseString,
    parseVariables,
    parseCommands,
    parseCommands2,
    $checkBrackets,
    $checkQuotes,
    cmds,
    $functions,
    sleep,
    writeReturnErr,
    makeVariable,
    parseFunction,
    parseVariablesFromWords,
    math
} from './utility.js'

import { parse } from '../exports/parse.js'

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    res.write(`
    <script>
        window.location = "https://github.com/0aoq/0aDocumentation"
    </script>
    `);

    res.end();
}).listen(8080);

export let variables = []
export let functions = []
let indexed = []

// main

export let parsedLines = []
export let parseHold = []

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
        if (multiline) {
            multi_line_required.push(name)
        }

        file_cmds.push({
            name: name,
            run: run
        })
    }
}

fs.readdir(path.resolve(__dirname, "../", "exports", "custom"), (err, files) => {
    if (err) {
        console.log(err)
    }

    files.forEach(file => {
        if (file.split(".")[1] == "js") { // file extension
            setTimeout(() => {
                require(path.resolve(__dirname, "../", "exports", "custom") + "/" + file)
            }, 100);
        }
    });
});

function getFromCustomCmds(name: string) {
    for (let datapoint of file_cmds) {
        if (datapoint.name == name) {
            return datapoint
        }
    }
}

// cmd functions

async function cmds__repeat_worker($do, $amount, $every) {
    var i
    for (i = 0; i < $amount; i++) {
        handleCommand($do)
        await sleep($every)
    }
}

export const findCmd = function (cmd, list = cmds) {
    let split = cmd.split(" ")
    let __indexed = 0

    for (let $cmd of list) {
        for (let space of split) {
            if (__indexed < 3) { // limit
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

// run

export const handleCommand = async function (cmd: string, callingFrom: string = "null", addToVariables: string = "", line?: number) {
    // all new required commands should be created in a custom command file.
    
    cmd = cmd.replace("    ", "") // remove \t spaces
    cmd = cmd.replace("\t", "") // remove \t spaces

    let $ = cmd.split(" ")

    if ($) {
        if ($[0] == "#") { return }

        // ===============
        // UTILITY
        // ===============
        if ($[0] == "val") { // &;cmd[val]
            let $name = getArgs(cmd, 2, 0)
            let $value = $name.split(" = ")[1]

            if (isNaN(parseInt($value))) {
                if (!getVariable($value)) {
                    if ($value[0] == '"') {
                        if ($checkQuotes($value)) {
                            makeVariable($name, $value.split('"')[1].split('"')[0], callingFrom || null, "string")
                        } else {
                            handleCommand("SyntaxError string was not closed properly.", callingFrom, addToVariables, line)
                        }
                    } else {
                        makeVariable($name, $value, callingFrom || null)
                    }
                }
            } else if (!isNaN(parseInt($value))) {
                makeVariable($name, parseInt($value), callingFrom || null, "int")
            }
        } else if ($[0] == "repeat") { // &;cmd[repeat]
            // repeat {/s} run makeFile {/args} makeDir = true {/arg} fileName = test/repeatThing.txt {/arg} {/set} 1 i 4
            $ = cmd.split(" ")
            let returned = cmd.split(" {/s} ")[1].split(" {/set} ")
            let $do = returned[0]
            let $amount = returned[1].split(" i ")[1]
            let $every = returned[1].split(" i")[0]

            cmds__repeat_worker($do, $amount, $every)
            // ===============
            // FUNCTIONS
            // ===============
        } else if ($[0] == "func") { // &;cmd[func]
            // func test{/s}log Hello, World!{/and}log New line
            // run test

            let $name = getArgs(cmd, 2, 0).split(" do")[0]

            if (getFunction($name) == null && $name != "null") {
                functions.push({
                    name: $name,
                    run: getFromHold($name).lines,
                    nestedto: callingFrom || "null"
                })

                setTimeout(() => {
                    getFromHold($name).lines = ['parsed', `line: ${getFromHold($name).on}`]
                }, 10);
            } else if (getFunction($name).run[0].split(" ")[0] != "func") { // fix strange error on nested functions where it would try to duplicate
                return handleCommand(`SyntaxError Function has already been declared.`, callingFrom, addToVariables, line)
            }
        } else if ($[0] == "run") { // &;cmd[run]
            if (getArgs(cmd, 2, 1) && $checkBrackets(getArgs(cmd, 2, 1))) {
                let args = parseFunction(getArgs(cmd, 2, 1)).split("; ")

                let returned = cmd.split(" ")[1]

                if (getFunction(returned).name) {
                    if (getFunction(returned).nestedto == "null" || getFunction(returned).nestedto == callingFrom) {
                        if (args) {
                            for (let arg of args) {
                                let $name = arg.split(" = ")[0]
                                let $value = arg.split(" = ")[1]

                                for (let val of variables) {
                                    if (val.function == getFunction(returned).name) {
                                        val.name = "&;0a__val:reset"
                                        val.val = ""
                                    }
                                }

                                makeVariable($name, $value, getFunction(returned).name || "null")
                            }
                        }

                        let uniqueId = "__&func:" + getFunction(returned).name
                        for (let command of getFunction(returned).run) {
                            command = command.replace("    ", "") // remove \t spaces
                            command = command.replace("\t", "") // remove \t spaces
                            handleCommand(parseVariables(command, getFunction(returned).name, uniqueId), getFunction(returned).name, uniqueId)
                        }
                    }
                } else {
                    handleCommand(`SyntaxError Function "${returned}" does not exist.`, callingFrom, addToVariables, line)
                }
            } else {
                handleCommand("SyntaxError Brackets were not opened and closed properly.", callingFrom, addToVariables, line)
            }
        }

        // =================
        // VARIABLES ALLOWED
        // =================

        /* $ = cmd.split(" ") // REPLACE BY utility.ts FUNCTION parseVariablesFromWords
        for (const $_ of $) { // parse all variables from every word
            $[$_] = $_.replace($_, parseVariables($_, callingFrom, addToVariables))
        } */

        if ($[0] == "SyntaxError") { // &;cmd[SyntaxErorr]
            console.log(colors.bold(colors.red(`[!] (${line || 1}) SyntaxError: ${getArgs(cmd, 2, 0)}`)))
        }
        // ===============
        // FILE SYSTEM
        // ===============
        else if ($[0] == "cd") { // &;cmd[cd]
            handleCommand('log (val:$cd)', callingFrom, addToVariables, line)
        } else if ($[0] == "read") { // &;cmd[read]
            let returned = parseVariables(getArgs(cmd, 2, 0), callingFrom,)
            console.log(returned)

            fs.readFile(returned, 'utf8', function (err, data) {
                if (err) {
                    console.log(colors.bold(colors.red(`SyntaxError: ${err}`)))
                }

                console.log('\x1b[32m%s\x1b[0m', '=====================')
                console.log(data)
                console.log('\x1b[32m%s\x1b[0m', '=====================')
            })
        } else if ($[0] == "clear") { // &;cmd[clear]
            console.clear()
        } else if ($[0] == "write") { // &;cmd[write]
            let $name = getArgs(cmd, 2, 0).split(" ")[0]
            let $data = getArgs(cmd, 2, 1)
            parseVariables($name, callingFrom)

            writeReturnErr($name, $data, false)
        } else if ($[0] == "write_add") { // &;cmd[write_add]
            let $name = getArgs(cmd, 2, 0).split(" ")[0]
            let $data = getArgs(cmd, 2, 1)
            parseVariables($name, callingFrom)

            writeReturnErr($name, $data, true)
        } else if ($[0] == "rm") { // &;cmd[rm]
            try {
                fs.unlinkSync(getArgs(cmd, 2, 0));
            } catch (err) {
                return console.log(colors.bold(colors.red(`Error: ${err}`)))
            }
        } else if ($[0] == "listdir") { // &;cmd[listdir]
            fs.readdir(getArgs(cmd, 2, 0), (err, files) => {
                if (err) {
                    return console.log(colors.bold(colors.red(`Error: ${err}`)))
                }

                files.forEach(file => {
                    console.log(file)
                });
            });
        } else if ($[0] == "mk") { // &;cmd[mk]
            if (cmd.split(" ")[1] == "includedir") {
                fs.mkdir(path.join(process.cwd(), cmd.split(" ")[2].split("/")[0]), (err) => {
                    if (err) {
                        return console.log(colors.bold(colors.red(`[!] Error: ${err}`)))
                    }
                });
            }

            fs.writeFile(parseVariables(cmd.split(" ")[2], callingFrom), "", function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Created.")
                }
            })
        } else if ($[0] == "exec") { // &;cmd[exec]
            parse(cmd, callingFrom, addToVariables, line)
        } else if ($[0] == "if") { // &;cmd[if]
            let func = parseVariables(getArgs(cmd, 2, 0), callingFrom).split(" do ")[0]

            let statement1 = func.split(" == ")[0]
            let statement2 = func.split(" == ")[1]

            if (statement2 == "null") {
                statement2 = null
            }

            if (statement1 == statement2) {
                handleCommand(getArgs(cmd, 2, 0).split(" do ")[1], callingFrom)
            }
        } else if ($[0] == "ifnot") { // &;cmd[ifnot]
            let func = parseVariables(getArgs(cmd, 2, 0), callingFrom).split(" do ")[0]

            let statement1 = func.split(" == ")[0]
            let statement2 = func.split(" == ")[1]

            if (statement2 == "null") {
                statement2 = null
            }

            if (statement1 != statement2) {
                handleCommand(getArgs(cmd, 2, 0).split(" do ")[1], callingFrom)
            }
        }
        // ===============
        // MATHEMATICS
        // ===============
        else if ($[0] == "calc") { // &;cmd[calc]
            let $_ = getArgs(cmd, 2, 0).split(" with ")[0].split(" ")
            let $operation = getArgs(cmd, 2, 0).split(" with ")[1]

            if ($operation == "+") {
                if (parseInt($_[0]) && parseInt($_[1])) {
                    console.log(parseInt($_[0]) + parseInt($_[1]))
                }
            } else if ($operation == "-") {
                if (parseInt($_[0]) && parseInt($_[1])) {
                    console.log(parseInt($_[0]) - parseInt($_[1]))
                }
            } else if ($operation == "*") {
                if (parseInt($_[0]) && parseInt($_[1])) {
                    console.log(parseInt($_[0]) * parseInt($_[1]))
                }
            } else if ($operation == "/") {
                if (parseInt($_[0]) && parseInt($_[1])) {
                    console.log(parseInt($_[0]) / parseInt($_[1]))
                }
            } else if ($operation == "^") {
                if (parseInt($_[0]) && parseInt($_[1])) {
                    Math.pow(parseInt($_[0]), parseInt($_[1]))
                }
            }
        }
        // ===============
        // DEBUG CMDS
        // ===============
        else if ($[0] == "debug") { // &;cmd[debug]
            let $_ = getArgs(cmd, 2, 0)

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
                console.log(cmds)
            } else if ($_ == "imported") {
                console.log(imported)
            } else if ($_ == "customcmds") {
                console.log(file_cmds)
            }
        }
        // ===============
        // UTIL FUNCTIONS
        // ===============
        else if ($[0] == "sleep") { // &;cmd[sleep]
            if ($checkBrackets(cmd.slice(4))) {
                let split = cmd.slice(4).split(")")[0].split("(")[1]
                await sleep(parseInt(split))
            } else {
                handleCommand("SyntaxError Brackets were not opened and closed properly.", callingFrom, addToVariables, line)
            }
        } else if ($[0] == "open") { // &;cmd[open]
            let url = getArgs(cmd, 2, 0)

            if (url) {
                var start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
                require('child_process').exec(start + ' ' + url);
            } else {
                handleCommand("SyntaxError Url not specified.", callingFrom, addToVariables, line)
            }
        } else if ($[0] == "import") {
            let service = parseString(getArgs(cmd, 2, 0))

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
            let returned = cmd.split(" ")[0]

            if (getVariable('val:' + returned, callingFrom) != null) {
                getVariable('val:' + returned, callingFrom).val = getArgs(cmd, 1, 0).split("= ")[1]
            }
        } else if (!cmd.split(" ") || !cmds.includes(cmd.split(" ")[0]) && !getFromCustomCmds(cmd.split(" ")[0])) {
            if (isNaN(parseInt(parseFunction(cmd).split(" ")[0]))) {
                handleCommand(`SyntaxError "${cmd}" is not recognized as a valid keyword.`, callingFrom, addToVariables, line)
            } else {
                if ($checkBrackets(cmd) && parseFunction(cmd)) {
                    math(parseFunction(cmd))
                }
            }
        }
        // ===============
        // FILE CMDS
        // ===============
        for (let space of cmd.split(" ")) {
            let __cmd = getFromCustomCmds(space)
            if (__cmd) {
                const custom_cmd = __cmd
                custom_cmd.run({
                    cmd: cmd,
                    callingFrom: callingFrom,
                    addToVariables: addToVariables,
                    line: line
                })
            }
        }
    }
}

// question prompt

console.log('')
console.log(colors.bold(colors.magenta('0a Interpreter ')) + 'Release Version: 0.6.2')
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
        });
    } else {
        promptcmd()
    }
})

// defaults

process.title = "0a Basic Command Line" // IF LAUNCHING FROM A COMMAND LINE, SET THE TITLE
handleCommand('val $cd = "' + process.cwd() + '"') // SET val:$cd TO BE THE WORKING DIRECTORY

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
    getLineAfterCmd
}

process.on('uncaughtException', (error)  => {
    console.log('0aInterpreter has encountered an error: ' + colors.bold(colors.red(error)))
    process.exit(1)
})