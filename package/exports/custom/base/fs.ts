import { createCmdFromFile, functions, getFromHold, handleCommand, variables } from '../../../core/index.js';
import * as utility from '../../../core/utility.js'

const fs = require('fs')
const colors = require('colors')
const path = require("path")

createCmdFromFile("read", false, function ($) {
    let returned = utility.parseVariables(utility.getArgs($.cmd, 2, 0), $.callingFrom, "", false, $.file)
    console.log(returned)

    fs.readFile(returned, 'utf8', function (err, data) {
        if (err) {
            console.log(colors.bold(colors.red(`SyntaxError: ${err}`)))
        }

        console.log('\x1b[32m%s\x1b[0m', '=====================')
        console.log(data)
        console.log('\x1b[32m%s\x1b[0m', '=====================')
    })
})

createCmdFromFile("write", false, function ($) {
    let $name = utility.getArgs($.cmd, 2, 0).split(" ")[0]
            let $data = utility.getArgs($.cmd, 2, 1)
            utility.parseVariables($name, $.callingFrom, "", false, $.file)

            utility.writeReturnErr($name, $data, false)
})

createCmdFromFile("write_add", false, function ($) {
    let $name = utility.getArgs($.cmd, 2, 0).split(" ")[0]
            let $data = utility.getArgs($.cmd, 2, 1)
            utility.parseVariables($name, $.callingFrom, "", false, $.file)

            utility.writeReturnErr($name, $data, true)
})

createCmdFromFile("rm", false, function ($) {
    try {
        fs.unlinkSync(utility.getArgs($.cmd, 2, 0));
    } catch (err) {
        return console.log(colors.bold(colors.red(`Error: ${err}`)))
    }
})

createCmdFromFile("listdir", false, function ($) {
    fs.readdir(utility.getArgs($.cmd, 2, 0), (err, files) => {
        if (err) {
            return console.log(colors.bold(colors.red(`Error: ${err}`)))
        }

        files.forEach(file => {
            console.log(file)
        });
    });
})

createCmdFromFile("mk", false, function ($) {
    if ($.cmd.split(" ")[1] == "includedir") {
        fs.mkdir(path.join(process.cwd(), $.cmd.split(" ")[2].split("/")[0]), (err) => {
            if (err) {
                return console.log(colors.bold(colors.red(`[!] Error: ${err}`)))
            }
        });
    }

    fs.writeFile(utility.parseVariables($.cmd.split(" ")[2], $.callingFrom, "", false, $.file), "", function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Created.")
        }
    })
})