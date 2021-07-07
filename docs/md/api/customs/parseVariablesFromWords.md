# parseVariablesFromWords()

parseVariablesFromWords() can be used to parse all the variable values from a command.

- line: **string**
- callingFrom: **string**
- addToVariables: **string**

```ts
import { createCmdFromFile, handleCommand, getLineAfterCmd } from '../../core/index.js';
import { parseVariablesFromWords } from '../../core/utility.js';

createCmdFromFile("test", false, function ($) {
    $.cmd = parseVariablesFromWords($.cmd, $.callingFrom, $.addToVariables)
    console.log($.cmd)
})
```