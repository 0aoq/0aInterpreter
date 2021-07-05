import { createCmdFromFile, imported, handleCommand, getFromHold } from '../../index.js';
import { getArgs } from '../utility.js';

const fs = require('fs')

createCmdFromFile("lua.new", true, function ($) {
    if (imported[0].lua == true) {
        let name = getArgs($.cmd, 2, 0).split(" do")[0].split(" --sandbox ")[0]
        setTimeout(() => {
            const CreateFiles = fs.createWriteStream(process.cwd() + "/" + name + ".lua", {
                flags: 'a'
            })

            for (let line of getFromHold(name).lines) {
                CreateFiles.write(line + '\r\n')
            }
        }, 1);
    } else {
        return handleCommand(`SyntaxError "lua.new" is not recognized as a valid keyword. Did you forget to import lua?`, "lua", "", 1)
    }
})