// npx tsc parse.ts
// node parse.js

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const writeReturnErr = function(fileName: string, newdata: string, add: boolean) {
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

const getArgs = function(cmd: string, limit: number, split: number) {
    let $ = cmd.split(" ", limit)
    $ = cmd.split($[split])

    let returned = $[1].slice(1)
    return returned
}

const handleCommand = function(cmd: string) {
    let $ = cmd.split(" ")
    if ($) {
        // ===============
        // FILE SYSTEM
        // ===============
        if ($[0] == "dirname") {
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

            writeReturnErr($name, $data, false)
        } else if ($[0] == "write_add") {
            let $name = getArgs(cmd, 2, 0).split(" ")[0]
            let $data = getArgs(cmd, 2, 1)

            writeReturnErr($name, $data, true)
        } else if ($[0] == "rm_file") {
            try {
                fs.unlinkSync(getArgs(cmd, 2, 0));
            } catch (err) {
                console.error(err);
            }
        } 
        // ===============
        // IF NO CMD
        // ===============
        else {
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
