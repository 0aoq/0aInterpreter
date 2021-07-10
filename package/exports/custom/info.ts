import { createCmdFromFile } from '../../core/index.js';

const colors = require('colors')
const os = require('os')

createCmdFromFile("info", false, function ($) {
    console.log(
`${colors.bold('-- --------------------' + colors.magenta(' 0a Interpreter ') + '-------------------- --')}
    ${colors.green(`Created: 6/12/2021,
    Repository: https://github.com/0aoq/0aInterpreter,`)}
${colors.bold('--- -------------------- LOCAL MACHINE -------------------- --')}
    ${colors.green(`CPU Model: ${os.cpus()[0].model},
    Host: ${os.hostname()},
    Platform: ${os.platform()}, ${os.arch()}`)}
${colors.bold('-------------------- -------------------- --------------------')}
    ${colors.green('info, https://github.com/0aoq/0aInterpreter/blob/main/package/exports/custom/info.ts')}
`)
})