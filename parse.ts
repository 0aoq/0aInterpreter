// npx tsc parse.ts
// node parse.js

const readline = require('readline')
const fs = require('fs')
const path = require('path')
const http = require('http')
const colors = require('colors');

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    res.write(`
        <style>
            * {
                margin: 0;
            }
            body {
                margin: 0;
                font-family: "Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
                background: #fff;
            }
            
            p {
                word-wrap: break-word;
                font-size: 15px;
            }
            @media screen and (min-width: 601px) {
                p {
                    font-size: 20px;
                }
                code {
                    font-size: 25px;
                }
            }
            @media screen and (max-width: 600px) {
                p {
                    font-size: 35px;
                }
                code {
                    font-size: 25px;
                }
            }
            pre:not(.ignore-style) {
                margin-top: 10px;
                margin-bottom: 10px;
                background: rgb(248, 248, 248);
                padding: 10px;
                border-radius: 5px;
            }
            code {
                font-size: 15px;
            }
        </style>
    `)

    res.write(`
        <p>localhost:8080/${req.url}</p>
    `);

    if (req.url == '/api') {
        res.write(`
        <br>
        <p><b>listdir</b> - List all files in a specified directory.</p>
        <br>
        <b><p>Directory:</b> (string)</p>
        <br>
        <hr>
        `)

        res.write(`
        
        <br>
        <p><b>val</b> - Create a new global variable that can be accessed from any instance that requires it.</p>
        <br>
        <b><p>name:</b> (string)</p>
        <b><p>value:</b> (any)</p>
        <br>
        <hr>
        
        `)

        res.write(`
        
        <br>
        <p><b>func</b> - Create a new global function that can be accessed from any instance that requires it.</p>
        <br>
        <b><p>name:</b> (string)</p>
        <b><p>actions:</b> (0a)</p>
        <pre><code>
func test{/s}
    // logs whatever parameter is given to the function
    log $:givenParam
{/end} &
        </code></pre>
        <p>Functions can be nested up to 2 functions, this limit is for clean code, as well as readability. If you must go past this, please create a seperate function.
This limit also applies to other multi line objects, if you have a nested function inside of another function, a multi line object will not be parsed if it is within the
nested function.</p>
        <pre><code>
func ifTest{/s}
    // logs "true" if value == another
    if $:param1 == hello => log true
    
    // logs "false" if value != another
    ifnot $:param2 == test_ing => log false

    func ifTest1{/s} // nested function
        log hello, world!
        log test2
        // cannot contain another nested function
    {/end} ifTest1
{/end} ifTest

run ifTest {/args} param1 = hello {/arg} param2 = testing {/arg}</code></pre>
        <br>
        <hr>
        
        `)

        res.write(`
        
        <br>
        <p><b>run</b> - Run a global function.</p>
        <br>
        <b><p>args:</b> (0a)</p>
        <pre><code>
run test {/args} givenParam = testing123 {/arg} 
        </code></pre>
        <br>
        <hr>
        
        `)

        res.write(`
        
        <br>
        <p><b>read</b> - Read a file from path</p>
        <br>
        <b><p>path:</b> (string)</p>
        <pre><code>read &;path</code></pre>
        <br>
        <hr>
        
        `)

        res.write(`
        
        <br>
        <p><b>write</b> - Write to a file from path</p>
        <br>
        <b><p>path:</b> (string)</p>
        <b><p>data:</b> (string)</p>
        <pre><code>write &;path &;data</code></pre>
        <br>
        <hr>
        
        `)

        res.write(`
        
        <br>
        <p><b>write_add</b> - Add to a file from path</p>
        <br>
        <b><p>path:</b> (string)</p>
        <b><p>data:</b> (string)</p>
        <pre><code>write_add &;path &;data</code></pre>
        <br>
        <hr>
        
        `)

        res.write(`
        
        <br>
        <p><b>rm</b> - Remove a file from path</p>
        <br>
        <b><p>path:</b> (string)</p>
        <pre><code>rm &;path</code></pre>
        <br>
        <hr>
        
        `)

        res.write(`
        
        <br>
        <p><b>mk</b> - Make a directory/file</p>
        <br>
        <b><p>includedir:</b> (boolean)</p>
        <b><p>path/name:</b> (string)</p>
        <pre><code>mk &;directory/test.0a</code></pre>
        <br>
        <hr>
        
        `)

        res.write(`
        
        <br>
        <p><b>cd</b> - Get current working directory</p>
        <br>
        <hr>
        
        `)

        res.write(`
        
        <br>
        <p><b>repeat</b> - Run a loop</p>
        <br>
        <b><p>actions:</b> (0a)</p>
        <b><p>every:</b> (number) [Pause thread time between loops (seconds)]</p>
        <b><p>i:</b> (number) [Amount of times to loop]</p>
        <pre><code>repeat {/s} &;actions {/set} &;every i &;i</code></pre>
        <br>
        <hr>
        
        `)

        res.write(`
        
        <br>
        <p><b>debug</b> - View stored tables of variables/functions</p>
        <br>
        <b><p>type:</b> (string)</p>
        <pre><code>debug variables</code></pre>
        <pre><code>debug functions</code></pre>
        <br>
        <hr>
        
        `)

        res.write(`
        
        <br>
        <p><b>if</b> - Run code if a statement == another statement</p>
        <br>
        <b><p>statement:</b> (string)</p>
        <b><p>run:</b> (0a)</p>
        <pre><code>
func ifTest{/s}
    // logs "true" if value == another
    if $:param1 == hello => log true
        
    // logs "false" if value != another
    ifnot $:param2 == test_ing => log false
{/end} ifTest
    
run ifTest {/args} param1 = hello {/arg} param2 = testing {/arg} 
// expected output: true
// expected output: false
        </code></pre>
        <br>
        <hr>
        
        `)
    }

    res.end();
}).listen(8080);

let variables = []
let functions = []
let indexed = []

const writeReturnErr = function (fileName: string, newdata: string, add: boolean) {
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

async function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

const getArgs = function (cmd: string, limit: number, split: number) {
    let $ = cmd.split(" ", limit)
    $ = cmd.split($[split])

    let returned = $[1].slice(1)
    return returned
}

// helpers

const getVariable = function ($name: string, $function: string = "null") {
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

const getFunction = function ($name: string) {
    for (let func of functions) {
        if (func.name == $name) {
            return func
        }
    }
}

const parseVariables = function ($content: string, $calling: string = "null", $add: string = "") {
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

    return $content
}

const makeVariable = function ($name: string, $value: string, $function) {
    if ($function == "null") {
        if (getVariable('val:' + $name.split(" = ")[0], $function) == null) {
            variables.push(
                {
                    name: 'val:' + $name.split(" = ")[0],
                    val: $value,
                    function: "null"
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
                    function: $function
                }
            )
        } else {
            getVariable('$:' + $name.split(" = ")[0], $function).val = $value
        }
    }
}

// main

let parsedLines = []
let parseHold = []

let cmds = [ // list of allowed keywords
    'val', 'repeat', 'func', 'run', 'cd', 'clear', 'write', 'write_add', 'rm',
    'listdir', 'mk', 'exec', 'calc', 'debug', 'set', '//', 'if', 'ifnot', 'rest',
    '{/end}'
]

function getFromHold($name) {
    for (let value of parseHold) {
        if (value.name == $name) {
            return value
        }
    }
}

const handleCommand = function (cmd: string, callingFrom: string = "null", addToVariables: string = "", line?: number) {
    cmd = cmd.replace("    ", "") // remove \t spaces
    cmd = cmd.replace("\t", "") // remove \t spaces

    let $ = cmd.split(" ")

    if ($) {
        // ===============
        // UTILITY
        // ===============
        if ($[0] == "val") { // &;cmd[val]
            let $name = getArgs(cmd, 2, 0)
            let $value = $name.split(" = ")[1]

            makeVariable($name, $value, callingFrom || null)
        } else if ($[0] == "repeat") { // &;cmd[repeat]
            // repeat {/s} run makeFile {/args} makeDir = true {/arg} fileName = test/repeatThing.txt {/arg} {/set} 1 i 4
            $ = cmd.split(" ")
            let returned = cmd.split(" {/s} ")[1].split(" {/set} ")
            let $do = returned[0]
            let $amount = returned[1].split(" i ")[1]
            let $every = returned[1].split(" i")[0]

            async function worker() {
                var i
                for (i = 0; i < $amount; i++) {
                    handleCommand($do)
                    await sleep($every)
                }
            }

            worker()
            // ===============
            // FUNCTIONS
            // ===============
        } else if ($[0] == "func") { // &;cmd[func]
            // func test{/s}log Hello, World!{/and}log New line
            // run test

            let $name = getArgs(cmd, 2, 0).split("{/s}")[0]

            if (getFunction($name) == null && $name != "null") {
                functions.push({
                    name: $name,
                    run: getFromHold($name).lines
                })

                setTimeout(() => {
                    getFromHold($name).lines = ['parsed', `line: ${getFromHold($name).on}`]
                }, 10);
            } else {
                handleCommand(`SyntaxError Function has already been declared.`, callingFrom, addToVariables, line)
            }
        } else if ($[0] == "run") { // &;cmd[run]
            let returned = cmd.split(" ")[1]

            if (returned == null) { return console.log("> SyntaxError: function doesn't exist.") }

            let args = cmd.split(" {/args} ")

            if (args) {
                args = args[1].split(" {/arg} ")
                returned = returned.split(" {/args} ")[0]
                for (let arg of args) {
                    let $name = arg.split(" = ")[0]
                    let $value = arg.split(" = ")[1]

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

        // =================
        // VARIABLES ALLOWED
        // =================

        for (let $_ of $) { // parse all variables from every word
            $[$_] = $_.replace($_, parseVariables($_, callingFrom, addToVariables))
        }

        if ($[0] == "log") { // &;cmd[log]
            console.log(getArgs(cmd, 2, 0))
        } else if ($[0] == "SyntaxError") { // &;cmd[SyntaxErorr]
            console.log(colors.bold(colors.red(`[!] (${line || 1}) SyntaxError: ${getArgs(cmd, 2, 0)}`)))
        }
        // ===============
        // FILE SYSTEM
        // ===============
        else if ($[0] == "cd") { // &;cmd[cd]
            console.log(getVariable("val:$cd").val)
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
                    console.log("Created.")
                }
            })
        } else if ($[0] == "exec") { // &;cmd[exec]
            $ = cmd.split(" ")
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
                            on: 0
                        }
                        let parsed = 0

                        // print all lines
                        lines.forEach((line) => {
                            parsed++

                            function $s() {
                                parseHold.push({
                                    name: getArgs(line, 2, 0).split("{/s}")[0],
                                    active: false,
                                    lines: [],
                                    on: parsed
                                })

                                self = getFromHold(getArgs(line, 2, 0).split("{/s}")[0])
                                self.active = true

                                handleCommand(line, callingFrom, addToVariables, parsed)
                                parsedLines.push(line)
                            }

                            // better multiline support for parser: still needs to be worked on!
                            if (line.trim().length !== 0) {
                                line = line.replace("    ", "") // remove \t spaces
                                line = line.replace("\t", "") // remove \t spaces

                                if (self.active == false) {
                                    if (line.split(" ")[0] == "func") {
                                        $s()
                                    } else {
                                        handleCommand(line, callingFrom, addToVariables, parsed)
                                        parsedLines.push(line)
                                    }
                                } else {
                                    if (line.split(" ")[0] == "{/end}") {
                                        if (line.split(" ")[1] == self.name) {
                                            self.active = false
                                            setTimeout(() => {
                                                self.lines = ['parsed',`file lines: ${parsed}`]
                                                self = {
                                                    name: null,
                                                    active: false,
                                                    lines: [],
                                                    on: 0
                                                }
                                            }, 1);
                                        }
                                    } else {
                                        if (line.split(" ")[0] == "func") {
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
        } else if ($[0] == "if") { // &;cmd[if]
            let func = parseVariables(getArgs(cmd, 2, 0), callingFrom).split(" => ")[0]

            let statement1 = func.split(" == ")[0]
            let statement2 = func.split(" == ")[1]

            if (statement2 == "null") {
                statement2 = null
            }

            if (statement1 == statement2) {
                handleCommand(getArgs(cmd, 2, 0).split(" => ")[1], callingFrom)
            }
        } else if ($[0] == "ifnot") { // &;cmd[ifnot]
            let func = parseVariables(getArgs(cmd, 2, 0), callingFrom).split(" => ")[0]

            let statement1 = func.split(" == ")[0]
            let statement2 = func.split(" == ")[1]

            if (statement2 == "null") {
                statement2 = null
            }

            if (statement1 != statement2) {
                handleCommand(getArgs(cmd, 2, 0).split(" => ")[1], callingFrom)
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
        } else if (!cmd.split(" ") || !cmds.includes(cmd.split(" ")[0])) {
            handleCommand(`SyntaxError "${cmd}" is not recognized as a valid keyword.`, callingFrom, addToVariables, line)
        }
    }
}

// question prompt

console.log("[!] Module base loaded correctly.")

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

let dir_input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

dir_input.question("[&] Load files from directory: (cd/scripts) ", function (cmd) {
    cmd = cmd || process.cwd() + "/scripts"
    fs.readdir(cmd, (err, files) => {
        if (err) {
            console.log(err)
        }

        files.forEach(file => {
            setTimeout(() => {
                handleCommand("exec " + cmd + "/" + file)
            }, 100);
        });

        promptcmd()
    });

    dir_input.close()
})

// defaults

process.title = "0a Basic Command Line"
handleCommand("val $cd = " + process.cwd())
