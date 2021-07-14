import { handleCommand, parseHold, parsedLines, getFromHold, multi_line_required, findCmd, getLineAfterCmd, config } from "../core/index.js"
import { getArgs, getBoolean } from '../core/utility.js'


const colors = require('colors')
import * as fs from 'fs'

export function parse(cmd: string, callingFrom: string, addToVariables: string, line: number) {
    if (!config[0].allowFileLoading) { return }
    
    let returned = getLineAfterCmd(cmd, "exec")

    if (returned.split(".")[1] === "0a") {
        fs.readFile(returned, 'utf-8', function (err, data) {
            if (err) {
                return console.log(colors.bold(colors.red(`Error: ${err}`)))
            }

            if (data) {
                // split the contents by new line
                const lines = data.split(/\r?\n/);

                let __self = {
                    name: null,
                    active: false,
                    lines: [],
                    on: 0,
                    sandboxed: false
                }

                let parsed = 0

                // print all lines
                lines.forEach((line) => {
                    parsed++

                    function $s() {
                        parseHold.push({
                            name: getArgs(line, 2, 0).split(" do")[0].split(" --sandbox ")[0],
                            active: false,
                            lines: [],
                            on: parsed,
                            sandboxed: getBoolean(getArgs(line, 2, 0).split(" do")[0].split(" --sandbox ")[1]) || false
                        })

                        __self = getFromHold(getArgs(line, 2, 0).split(" do")[0].split(" --sandbox ")[0])
                        __self.active = true

                        handleCommand(line, callingFrom, addToVariables, parsed, null, returned)
                        parsedLines.push(line)
                    }

                    // better multiline support for parser: still needs to be worked on!
                    if (line.trim().length !== 0) {
                        for (let i = 0; i < 10000; i++) { // remove tabs up to 10,000, Error: line.replaceAll is not a function.
                            if (!__self.sandboxed) {
                                line = line.replace("    ", "") // remove \t spaces
                                line = line.replace("\t", "") // remove \t spaces
                            }
                        }

                        if (__self.active === false) {
                            if (multi_line_required.includes(findCmd(line))) {
                                $s()
                            } else {
                                handleCommand(line, callingFrom, addToVariables, parsed, null, returned) // outside of function
                                parsedLines.push(line)
                            }
                        } else {
                            if (line.split(" ")[0] === "end") {
                                if (line.split(" ")[1] === __self.name) {
                                    __self.active = false
                                    setTimeout(() => {
                                        __self.lines = ['parsed', `file lines: ${parsed}`]
                                        __self = {
                                            name: null,
                                            active: false,
                                            lines: [],
                                            on: 0,
                                            sandboxed: false
                                        }
                                    }, 100);
                                }
                            } else if (line.split(" ")[0] === "thread:end") {
                                if (line.split(" ")[1] === __self.name) {
                                    __self.active = false
                                    setTimeout(() => {
                                        __self.lines = ['parsed', `file lines: ${parsed}`]
                                        __self = {
                                            name: null,
                                            active: false,
                                            lines: [],
                                            on: 0,
                                            sandboxed: false
                                        }
                                    }, 100);
                                }
                            } else {
                                if (multi_line_required.includes(line.split(" ")[0])) {
                                    $s()
                                }

                                if (__self.name != null) {
                                    __self.lines.push(line)
                                } else {
                                    parsedLines.push(line)
                                }
                            }
                        }

                        for (let held of parseHold) {
                            if (held.active === true) {
                                __self = held
                            }
                        }
                    }
                });
            } else {
                handleCommand(`SyntaxError File has no data.`, callingFrom, addToVariables, line)
            }
        })
    } else {
        return handleCommand(`SyntaxError File must be a .0a file`, callingFrom, addToVariables)
    }
}