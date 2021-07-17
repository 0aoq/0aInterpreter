import { createCmdFromFile } from '../../../core/index.js';
import * as utility from '../../../core/utility.js';

createCmdFromFile("math", false, function ($) {
    $.cmd = utility.parseVariables(utility.parseFunction($.cmd), $.callingFrom, $.addToVariables, false, $.file); return utility.math($.cmd)
})