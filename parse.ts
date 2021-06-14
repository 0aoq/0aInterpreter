// npx tsc parse.ts
// node parse.js

const readline = require('readline')
const fs = require('fs')
const path = require('path')
const http = require('http')
const opn = require('opn');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    res.write(`
        <style>
            * {
                margin: 0;
            }
        </style>
    `)

    res.write(`
        <p>localhost:8080/${req.url}</p>
    `);

    if (req.url == '/listdir') {
        res.write(`
        <p><b>listdir</b> - List all files in a specified directory.</p>
        <br>
        <b><p>Directory:</b> (string)</p>
        `)
    }

    res.end();
}).listen(8080);

let variables = []

const $check = function(expr){
    const holder = []
    const openBrackets = ['(','{','[']
    const closedBrackets = [')','}',']']
    for (let letter of expr) { // loop trought all letters of expr
        if(openBrackets.includes(letter)){ // if its oppening bracket
            holder.push(letter)
        }else if(closedBrackets.includes(letter)){ // if its closing
            const openPair = openBrackets[closedBrackets.indexOf(letter)] // find its pair
            if(holder[holder.length - 1] === openPair){ // check if that pair is the last element in the array
                holder.splice(-1,1) // if so, remove it
            }else{ // if its not
                holder.push(letter)
                break // exit loop
            }
        }
    }
    return (holder.length === 0) // return true if length is 0, otherwise false
}

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

async function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

const getArgs = function(cmd: string, limit: number, split: number) {
    let $ = cmd.split(" ", limit)
    $ = cmd.split($[split])

    let returned = $[1].slice(1)
    return returned
}

const getVariable = function($name: string) {
    for (let variable of variables) {
        if (variable.name == $name) {
            return variable
        }
    }
}

const handleCommand = function(cmd: string) {
    let $ = cmd.split(" ")
    if ($) {
        if ($[0] == "log") {
            $ = cmd.split($[0])
            let returned = $[1].slice(1)
            
            if (getVariable(returned) != null) {
                console.log(getVariable(returned).val)
            } else {
                console.log(returned)
            }
        } 
        // ===============
        // FILE SYSTEM
        // ===============
        else if ($[0] == "dirname") {
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
        } else if ($[0] == "rm") {
            try {
                fs.unlinkSync(getArgs(cmd, 2, 0));
            } catch (err) {
                console.error(err);
            }
        } else if ($[0] == "listdir") {
            fs.readdir(getArgs(cmd, 2, 0), (err, files) => {
                if (err) {
                    console.log(err)
                }

                files.forEach(file => {
                    console.log(file)
                });

                console.log("Open localhost//listdir for more information on this command.")
            });
        } else if ($[0] == "mk") {
            if (getArgs(cmd, 2, 0) == "includedir") {
                fs.mkdir(path.join(__dirname, cmd.split(" ")[1].split("/")[0]), (err) => {
                    if (err) {
                        return console.error(err);
                    }
                });
            }

            fs.writeFile(getArgs(cmd, 2, 1), "", function(err) {
                if (err) {
                    console.log("Created.")
                }
            })
        } else if ($[0] == "exec") {
            $ = cmd.split($[0])
            let returned = $[1].slice(1)

            if (returned.split(".")[1] == "0a") {
                fs.readFile(returned, 'utf8', function (err, data) {
                    if (err) {
                        console.log("Recent command returned an error.")
                    }
    
                    // split the contents by new line
                    const lines = data.split(/\r?\n/);
    
                    // print all lines
                    lines.forEach((line) => {
                        handleCommand(line)
                    });
                })
            } else {
                console.log("> Error: file must be a .0a file!")
            }
        }
        // ===============
        // UTILITY
        // ===============
        else if ($[0] == "val") {
            let $name = getArgs(cmd, 2, 0)
            let $value = $name.split(" = ")[1]

            if (getVariable('val:' + $name.split(" = ")[0]) == null) {
                variables.push(
                    {
                        name: 'val:' + $name.split(" = ")[0],
                        val: $value
                    }
                )
            } else {
                console.log(`> Syntax error: variable has already been declared. Please set it with "${$name.split(" = ")[0]} = ${$value}"`)
            }
        } else if ($[0] == "repeat") {
            $ = cmd.split(" ")
            let returned = getArgs(cmd, 2, 0).split(" => wait ")
            let $do = returned[0]
            let $every = returned[1]

            async function worker() {
                var i
                for (i = 0; i < $every; i++) {
                    handleCommand($do)
                    await sleep($every)
                } 
            }

            worker()
        }
        // ===============
        // IF NO CMD
        // ===============
        else {
            let returned = cmd.split(" ")[0]
            
            if (getVariable('val:' + returned) != null) {
                getVariable('val:' + returned).val = getArgs(cmd, 1, 0).split("= ")[1]
            } else {
                console.log("> Command not recognized.")
            }
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
