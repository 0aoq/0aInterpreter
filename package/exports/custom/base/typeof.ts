import { createCmdFromFile } from '../../../core/index.js';
import * as utility from '../../../core/utility.js'

createCmdFromFile("typeof", false, function ($) {
    // coming soon
    $.cmd = utility.parseVariables($.cmd, $.callingFrom, $.addToVariables)
    return 'number' // using this function to test return values from custom cmds
})