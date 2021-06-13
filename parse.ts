// npx tsc parse.ts
// node parse.js

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const writeReturnErr = function(fileName: string, newdata: string, add: boolean) {
    fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) {
            return
        }

        let $ = newdata
        if (add) {
            $ = data += newdata
        }

        fs.writeFile(fileName, $, function (err) {
            if (err) return console.log(err)
        })
    })
}

const getArgs = function(cmd: string, limit: number, split: number) {
    let $ = cmd.split(" ", limit)
    $ = cmd.split($[split])

    let returned = $[1].slice(1)
    return returned
}

const handleCommand = function(cmd: string) {
    let $ = cmd.split(" ")
    if ($) {
        if ($[0] == "log") {
            $ = cmd.split($[0])
            let returned = $[1].slice(1)

            fs.readFile('log.cmdreturn', 'utf8', function (err, data) {
                if (err) {
                    fs.writeFile('log.cmdreturn', `["${returned}"], `, function (err) {
                        if (err) return console.log(err)
                    })
                }
        
                let newData = data += `["${returned}"], `
                fs.writeFile('log.cmdreturn', newData, function (err) {
                    if (err) return console.log(err)
                })
            })
        } else if ($[0] == "dirname") {
            console.log(__dirname)
        } else if ($[0] == "read") {
            $ = cmd.split($[0])
            let returned = $[1].slice(1)

            fs.readFile(returned, 'utf8', function (err, data) {
                if (err) {
                    console.log("Recent command returned an error.")
                }

                console.log('\x1b[32m%s\x1b[0m', '=====================')
                console.log(data)
                console.log('\x1b[32m%s\x1b[0m', '=====================')
            })
        } else if ($[0] == "clear") {
            console.clear()
        } else if ($[0] == "write") {
            let $name = getArgs(cmd, 2, 0).split(" ")[0]
            let $data = getArgs(cmd, 2, 1)
            let $add = false

            if (getArgs(cmd, 2, 0).split(" ")[1] == "true") {
                $add = true
            }

            writeReturnErr($name, $data, $add)
        } else {
            console.log("> Command not recognized.")
        }
    }
}

const promptcmd = function() {
    let cmd_input = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    
    cmd_input.question("> ", function(cmd) {
        handleCommand(cmd)
        cmd_input.close()
        promptcmd()
    })
}

promptcmd()
