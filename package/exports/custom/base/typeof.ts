import { Type } from '../../../core/datatypes.js';
import { createCmdFromFile, getLineAfterCmd } from '../../../core/index.js';
import * as utility from '../../../core/utility.js'

createCmdFromFile("typeof", false, function ($) {
    $.cmd = utility.parseVariables($.cmd, $.callingFrom, $.addToVariables, false, $.file)
    
    const after = getLineAfterCmd($.cmd, "typeof")
    const __function = utility.parseFunction(after)

    if (utility.$checkBrackets(after) && __function) {
        return utility.getStringType(__function) || Type.NULL
    }
})