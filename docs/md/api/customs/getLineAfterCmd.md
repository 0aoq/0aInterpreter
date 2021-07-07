# getArgs()

Get args is required from `core/index.js` and is used to get the string following the set command. The difference betweem this and getArgs is, getLineAfterCmd uses the updated method to return the line directly after the command, including after command settings such as static.

- line: **string**
- command: **string**

```ts
import { createCmdFromFile, handleCommand, getLineAfterCmd } from '../../core/index.js';

createCmdFromFile("test", false, function ($) {
    const args = getLineAfterCmd($.cmd, 'test') // returns all text after "test"
    console.log(args)
})
```