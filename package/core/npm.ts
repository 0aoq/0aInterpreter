import { handleCommand } from "./index.js";

const colors = require('colors')

console.log('Thanks for installing 0aInterpreter! Use the "run" function to run a command from your javascript file. It is recommended to use 0ainterpreter as a CLI if you want the best experience.')
console.log(colors.red(colors.bold('0aInterpreter: Running from js file, file loading and custom commands are disabled.')))

export const run = function (cmd, callingFrom) {
    handleCommand(cmd, callingFrom, "", 1)
}

export default {
    run
}

/*

INFORMATION

0aInterpreter is meant to be run from a console and running it with node. Running 0aInterpreter with require() will allow for limited access to 0aInterpreter.
This file is the set starting file for 0aInterpreter so that 0aInterpreter doesn't run into any errors that are caused by it being meant to be used as a CLI.

https://github.com/0aoq/0aInterpreter
https://www.npmjs.com/package/0ainterpreter

*/