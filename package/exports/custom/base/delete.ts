import { createCmdFromFile, getLineAfterCmd, handleCommand, removeVariable } from '../../../core/index.js';
import * as utility from '../../../core/utility.js'

createCmdFromFile("delete", false, function ($) {
    // $.cmd = utility.parseVariables($.cmd, $.callingFrom, $.addToVariables)

    const after = getLineAfterCmd($.cmd, "delete")
    const __function = utility.parseFunction(after)
    
    if (utility.$checkBrackets(after) && __function) {
        let possible_val = utility.getVariable(__function, $.callingFrom, $.file)
        
        if (possible_val) {
            removeVariable(possible_val)
        } else {
            handleCommand(`SyntaxError Delete type not recognized.`, $.callingFrom, $.addToVariables, $.line)
        }
    } else {
        handleCommand(`SyntaxError Brackets not opened and closed properly for delete.`, $.callingFrom, $.addToVariables, $.line)
    }
})