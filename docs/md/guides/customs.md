# Custom Commands

Hello! Any javascript files within this /custom/ folder will be required and run so for support for custom commands. Below is a description on how to create custom commands.

```ts
// import from index.ts
import { createCmdFromFile, getLineAfterCmd } from '../../core/index.js';
// import from utility.ts
import * as utility from '../../core/utility.js'

// example basic custom cmd for logging values (without type support)
// name, isMultiLine, callback
createCmdFromFile("example", false, function ($)) {
    /* $ returns an array with everything needed by index.js/handleCommand,
        $.cmd: The full line,
        $.callingFrom: The calling function/null if none,
        $.addToVariables: A string to add on to variables (Half deprecated as of 7/11/2021)
    */

    const after = getLineAfterCmd($.cmd, "example") // line: full line, cmd: the name of the run command
    console.log(after) // log everything after "example"; "example 'Hello, world!'" returns "Hello, world!"
}