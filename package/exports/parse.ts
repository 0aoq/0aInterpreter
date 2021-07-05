import { handleCommand, parseHold, parsedLines, getFromHold, multi_line_required } from "../index.js"
import { getArgs, getBoolean } from './utility.js'

const colors = require('colors')
const fs = require('fs')

export function parse(cmd: string, callingFrom: string, addToVariables: string, line: number) {
    let $ = cmd.split(" ")
    $ = cmd.split($[0])
    let returned = $[1].slice(1)

    if (returned.split(".")[1] == "0a") {
        fs.readFile(returned, 'utf8', function (err, data) {
            if (err) {
                return console.log(colors.bold(colors.red(`Error: ${err}`)))
            }

            if (data) {
                // split the contents by new line
                const lines = data.split(/\r?\n/);

                let self = {
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

                        self = getFromHold(getArgs(line, 2, 0).split(" do")[0].split(" --sandbox ")[0])
                        self.active = true

                        handleCommand(line, callingFrom, addToVariables, parsed)
                        parsedLines.push(line)
                    }

                    // better multiline support for parser: still needs to be worked on!
                    if (line.trim().length !== 0) {
                        for (let i = 0; i < 10000; i++) { // remove tabs up to 10,000
                            if (!self.sandboxed) {
                                line = line.replace("    ", "") // remove \t spaces
                                line = line.replace("\t", "") // remove \t spaces
                            }
                        }

                        if (self.active == false) {
                            if (multi_line_required.includes(line.split(" ")[0])) {
                                $s()
                            } else {
                                handleCommand(line, callingFrom, addToVariables, parsed)
                                parsedLines.push(line)
                            }
                        } else {
                            if (line.split(" ")[0] == "end") {
                                if (line.split(" ")[1] == self.name) {
                                    self.active = false
                                    setTimeout(() => {
                                        self.lines = ['parsed', `file lines: ${parsed}`]
                                        self = {
                                            name: null,
                                            active: false,
                                            lines: [],
                                            on: 0,
                                            sandboxed: false
                                        }
                                    }, 100);
                                }
                            } else if (line.split(" ")[0] == "thread:end") {
                                if (line.split(" ")[1] == self.name) {
                                    self.active = false
                                    setTimeout(() => {
                                        self.lines = ['parsed', `file lines: ${parsed}`]
                                        self = {
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

                                if (self.name != null) {
                                    self.lines.push(line)
                                } else {
                                    parsedLines.push(line)
                                }
                            }
                        }

                        for (let held of parseHold) {
                            if (held.active == true) {
                                self = held
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