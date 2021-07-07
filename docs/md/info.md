# Info

0a is built with typescript, compiled into javascript, and hosted with node.js
A very simple node command line basic programming language. Documentation at localhost:8080/api on any machine hosting it with node.js 

It is open source on **[github](https://github.com/0aoq/0a-Parser)**
<br><br>

## Multi line parsing

0a is parsed with a very simple typescript parser that is run with node.js, when parsing functions that take up multiple lines, the parser will add each function to a **parsehold** that will be used to tell when a function needs to be redone to fully complete parsing. You can view the parse hold with the [debug](index.html?md/api/keywords/debug.md) command.

```
// 0a
debug parsehold
```

All lines outside of a multi line function will be added to a **parsedlines** array. This can be viewed with the debug command.

```
// 0a
debug parsedlines
```

The following snippet shows how data is saved to an array for later debugging and for utility.

```
// ts

function $s() {
    parseHold.push({
        name: getArgs(line, 2, 0).split("{/s}")[0],
        active: false,
        lines: [],
        on: parsed
    })

    self = getFromHold(getArgs(line, 2, 0).split("{/s}")[0])
    self.active = true

    handleCommand(line, callingFrom, addToVariables, parsed)
    parsedLines.push(line)
}
```

The **getFromHold** functions is used to retrive the lines of a multi line function from the **parsehold** array.

```
// ts

function getFromHold($name) {
    for (let value of parseHold) {
        if (value.name == $name) {
            return value
        }
    }
}
```

## Variables

Variables in 0a are referenced with `val:&;name` and will be automatically replaced for every command that supports variable usage.

```
// ts

for (let $_ of $) { // parse all variables from every word
    $[$_] = $_.replace($_, parseVariables($_, callingFrom, addToVariables))
}
```

```
// 0a

val logtest = hello
log val:logtest
// expected output: hello
```

For more information on variables, view the [understanding variables](index.html?md/guides/variables.md) guide.

<br><br>