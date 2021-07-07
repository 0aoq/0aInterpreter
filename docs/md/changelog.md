# Change log

## 7/4/2021

### Api Changes

- Custom command support enabled
- Custom module support enabled
- Interpreter split up into multiple files
- Improved multi-line parsing support

### Documentation Changes

- Updated for day **7/4/2021**
- Updated for day **6/29/2021**

### Github Changes

- All updates pushed.

### Release Information
```json
{
    "name": "0aInterpreter",
    "author": "0a_oq",
    "version": "0.6.1",
    "stable": true,
    "commit": "https://github.com/0aoq/0aInterpreter/commit/062d46eb6fcd204c67844b56c73a862350f1bbd3"
}
```

## 6/29/2021

### Api Changes

- Changed syntax for **all** multi-line functions
- Infinite nested functions

```lua
func test do
    log ($:param)
end test

run test (param = "123")

// expected output: 123
```

### Documentation Changes

- Fixed documentation for if
- Updated for day **6/29/2021**

### Github Changes

- Most updates pushed.

### Release Information
```json
{
    "name": "0aInterpreter",
    "author": "0a_oq",
    "version": "0.5.4",
    "stable": true,
    "commit": "https://github.com/0aoq/0aInterpreter/commit/2b11055be627696e430ddeadf9bc9a416ce9dc1d"
}
```

## 6/28/2021

### Api Changes

- Create split method for strings `.split('"')[1].split('"')[0]`
- Log function reworked to require a string value, will return SyntaxError if not given
- Create parse functions for 2 split methods

```
// returns text inside of quotes

const parseString = function ($content: string) {
    return $content.split('"')[1].split('"')[0]
}

// returns text inside of parenthesis

const parseFunction = function ($content: string) {
    return $content.split(")")[0].split("(")[1]
}

```

- Automated variable types
- Variables now support strings and integers
- Improved error handling for log function
- Automated types for log function

```lua
val test1 = "hello, world!"
log (val:test1)

// expected output: hello, world!
```

```lua
val test2 = 1
log (val:test2)

// expected output: 1
```

### Documentation Changes

- Updated for day **6/28/2021**

### Github Changes

- All updates pushed.

### Release Information
```json
{
    "name": "0aInterpreter",
    "author": "0a_oq",
    "version": "0.5.3",
    "stable": true,
    "commit": "null"
}
```

## 6/17/2021

### Api Changes

- Function syntax changes
- Run syntax changes
- Log command syntax changed
- Remove node server
- Create parseCommands
- Create split method `getArgs(cmd, 2, 0).split(")")[0].split("(")[1]`
- Simplified api
- Update parameters on second run of function, more info at `debug variables`
- Update parseVariables
- Fix variable parsing

### Documentation Changes

- Updated all guides relating to changed syntax
- Create api/functions/log.md
- Update index.md
- Create changelog.md
- Update info.md

### Github Changes

- Rename 0aoq/0a-Parser to 0aoq/0aInterpreter
- Documentation open sourced
- All updates pushed

### Release Information
```json
{
    "name": "0aInterpreter",
    "author": "0a_oq",
    "version": "0.5.2",
    "stable": true,
    "commit": "https://github.com/0aoq/0aInterpreter/commit/a3310cdc1f98f5d632b278d4afc596ebca32bffc"
}
```

[comment]: <> (===============================================================)

## 6/16/2021

### Api Changes

- Multi line parsing changes
- Create new split method:

```ts
cmd = cmd.replace("    ", "") // remove \t spaces
cmd = cmd.replace("\t", "") // remove \t spaces
```

### Documentation Changes

- Create api/files/cd.md
- Create api/files/mk.md
- Create api/files/read.md
- Create api/files/rm.md
- Create api/files/write_add.md
- Create api/files/write.md
- Create api/functions/if.md
- Create api/functions/log.md
- Create api/functions/repeat.md
- Create api/keywords/debug.md
- Create api/keywords/func.md
- Create api/keywords/run.md

### Github Changes

- All updates pushed

### Release Information
```json
{
    "name": "0aParser",
    "author": "0a_oq",
    "version": "0.5.1",
    "stable": false,
    "commit": "https://github.com/0aoq/0aInterpreter/commit/8851565c13156789d9e8f2599c45ff3ea9f58a19"
}
```

[comment]: <> (===============================================================)

## 6/13/2021 - 6/15/2021

### Api Changes

- Update parse.ts (x26)
- Project start

### Documentation Changes

- Create node server

### Github Changes

- Create 0aoq/0a-Parser
- All updates pushed

### Release Information
```json
{
    "name": "0aParser",
    "author": "0a_oq",
    "version": "0.4.1 - 0.5.1",
    "stable": false,
    "commit": null
}
```

<br><br>