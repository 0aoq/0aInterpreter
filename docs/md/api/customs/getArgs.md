# getArgs()

| **Deprecation Warning:** getArgs() is deprecated. Please use `core/index.js` getLineAfterCmd() |
|:-:|

Get args is required from `core/utility.js` and is used to get the string following the set command.

```ts
import { createCmdFromFile, handleCommand } from '../../core/index.js';
import { getArgs } from '../../core/utility.js';

createCmdFromFile("test", false, function ($) {
    const args = getArgs($.cmd, 2, 0)
    console.log(args)
})
```